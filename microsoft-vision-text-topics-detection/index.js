/**
 * @fileoverview The lambda handler.
 */

/**
 * Module dependencies
 */
// @flow
const util = require('util');
const ComputerVision = require('./microsoft/computer-vision');
const ImageAdaptor = require('./microsoft/image-adaptor');
const Logger = require('./box/logger-manager');
const { SkillsErrorEnum } = require('./box/skills-kit-2.1');


const parseMicrosoftImageError = (error) => {
        if (this.error === 'InvalidImageFormat') return SkillsErrorEnum.INVALID_FILE_FORMAT;
        // full error : 'Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription.'
        if (this.error.includes('Access denied') return SkillsErrorEnum.EXTERNAL_AUTH_ERROR;
        return SkillsErrorEnum.FILE_PROCESSING_ERROR; // for 'InvalidImageUrl', 'FailedToProcess' and 'BadArgument' or any other errors
    }

/**
 * This function handles processing of event from Box
 * @param {Object} skillComponents - skillComponents response from  BoxEventManager.parseEventRequestBody call
 * @return {Object} - { imageAnalysis, textExtractions }
 */
const processImageAzureVision = async (subscriptionKey: string, fileDownloadURL: string) => {
    // call Microsoft Cognition Services
    const [imageAnalysis, textExtractions] = await ComputerVision.getComputeServicesResults(
        subscriptionKey,
        fileDownloadURL
    ).catch((error) => {
        Logger.logError(`Runtime exception while making Microsoft call: ${util.inspect(error)}`);
        throw new Error(SkillsErrorEnum.NO_INFO_FOUND);
    });

    // check for Microsoft errors:
    const { code, message } = imageAnalysis;
    if (code && message) {
        Logger.logError(`Microsoft error returned: ${util.inspect(imageAnalysis)}`);
        throw new Error(parseMicrosoftImageError(code));
    }
    return { imageAnalysis, textExtractions };
};

/**
 * This is the main function that the Lambda will call when invoked.
 *
 * @param {Object} event - data from the event, including the payload of the webhook, that triggered this function call
 * @param {Object} context - additional context information from the request (unused in this example)
 * @param {Function} callback - the function to call back to once finished
 * @return {null} - lambda callback
 */
module.exports.handler = async (event: Object, context: Object, callback: Function): void => {
    let skillsWriter;
    try {
        // setup the skill development helper tools
        const { id, source, box_internal_config: boxInternalConfig } = JSON.parse(event.body);
        Logger.setupLogger(id, source.id); // Logger will now write back request and file id in the logs
        const filesReader = new FilesReader(event.body);
        skillsWriter = new SkillsWriter(filesReader.getFileContext());


        const { MICROSOFT_KEY } = process.env;

        //validate allowed file formats and size limit
        const SKILL_ACCEPTED_FORMATS = process.env.SKILL_ACCEPTED_FORMATS.replace(/\s/g, '').split(',');
        filesReader.validateFormat(SKILL_ACCEPTED_FORMATS);
        if (process.env.SKILL_FILE_SIZE_LIMIT_MB) filesReader.validateSize(process.env.SKILL_FILE_SIZE_LIMIT_MB);

        let imageURL = null;
        if (process.env.SKILL_USE_ORIGINAL_FILE_FOR.includes(filesReader.getFileContext().fileFormat)) {
            imageURL = await filesReader.getFileContext().fileDownloadURL;
        } else {
            imageURL = await filesReader.getBasicFormatFileURL();
        }
        const { imageAnalysis, textExtractions } = await processImageAzureVision({MICROSOFT_KEY}, imageURL);
        Logger.logDebug(`Results recieved: ${JSON.stringify(imageAnalysis)},${JSON.stringify(textExtractions)}`);
        const cards = ImageAdaptor.getSkillMetadataCards(skillsWriter, imageAnalysis, textExtractions);
        Logger.logDebug(`Cards created as: ${JSON.stringify(cards)}`);
        skillsWriter.saveDataCards(cards); // write back result Metadata cards for Topics, Caption and Transcript
    } catch (e) {
        Logger.logError(`Exception caught: ${e.message}`);
        if (skillsWriter) await skillsWriter.saveErrorCard(e.message);
    } finally {
        // always respond to initial event pump POST request with 200
        // and anticipate the process to complete before lambda timeout.
        callback(null, {
            statusCode: 200,
            body: 'Event request processed'
        });
    }
};
