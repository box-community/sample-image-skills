/**
 * @fileoverview The lambda handler.
 */

/**
 * Module dependencies
 */
// @flow
const util = require('util');
const GoogleVision = require('./google/vision.js');
const ImageAdaptor = require('./google/image-adaptor.js');
const Logger = require('./box/logger-manager');
const { SkillsErrorEnum } = require('./box/skills-kit-2.1');

const parseGoogleImageError = (error) => {
        if (error.includes('ACCOUNT_NOT_FOUND')) return SkillsErrorEnum.EXTERNAL_AUTH_ERROR;
        return SkillsErrorEnum.FILE_PROCESSING_ERROR; // for 'GENERAL' and 'BAD_IMAGE_DATA' or any other errors
    }

/**
 * This function handles processing of event from Box
 * @param {Object} event - event details object
 * @return {void}
 */
const processImageWithGcv = async (gcvKeys: Object, image: string) => {
    const skill = new GoogleVision(gcvKeys);
    Logger.logInfo('Uploading file to Google Vision Image Annotation');
    const responses = await skill.getAnnotations(image).catch((error) => {
        Logger.logError(`Runtime exception while making Google call: ${util.inspect(error)}`);
        throw new Error(SkillsErrorEnum.NO_INFO_FOUND);
    });
    const annotationImageResponse = JSON.parse(JSON.stringify(responses[0]));
    Logger.logDebug(`Gcv response: ${util.inspect(annotationImageResponse)}`);
    if (annotationImageResponse.error) {
        Logger.logError(JSON.stringify(annotationImageResponse.error));
        throw new Error(parseGoogleImageError(annotationImageResponse.error));
    }
    return annotationImageResponse;
};

/**
 * This is the main function that the Lamba will call when invoked.
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


        const { GCV_CLIENT_EMAIL, GCV_PROJECT_ID, GCV_PRIVATE_KEY } = process.env;

        //validate allowed file formats and size limit
        const SKILL_ACCEPTED_FORMATS = process.env.SKILL_ACCEPTED_FORMATS.replace(/\s/g, '').split(',');
        filesReader.validateFormat(SKILL_ACCEPTED_FORMATS);
        if (process.env.SKILL_FILE_SIZE_LIMIT_MB) filesReader.validateSize(process.env.SKILL_FILE_SIZE_LIMIT_MB);

        let base64ImageString = null;
        if (process.env.SKILL_USE_ORIGINAL_FILE_FOR.includes(filesReader.getFileContext().fileFormat)) {
            base64ImageString = await filesReader.getContentBase64();
        } else {
            base64ImageString = await filesReader.getBasicFormatContentBase64();
        }
        const annotationImageResponse = await processImageWithGcv({ GCV_CLIENT_EMAIL, GCV_PROJECT_ID, GCV_PRIVATE_KEY }, base64ImageString);
        Logger.logDebug(`Results recieved: ${JSON.stringify(annotationImageResponse)}`);
        const cards = await ImageAdaptor.getSkillMetadataCards(skillsWriter, annotationImageResponse);
        Logger.logDebug(`Cards created as: ${JSON.stringify(cards)}`);
        await skillsWriter.saveDataCards(cards);
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
