type Options = {
    uri: string,
    qs: Object,
    body: string,
    headers: Object
};

const request = require('request');
const Logger = require('./box/logger-manager');

/**
 * Computer Vision SDK Api docs-
 * https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/node-analyze
 * https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/node-print-text
 */
// @flow
class ComputerVision {
    static async getComputeServicesResults(subscriptionKey: string, fileDownloadURL: string) {
        // must use the same location in your REST call as you used to get your
        // subscription keys. For example, if you got your subscription keys from
        // westus, replace "westcentralus" in the URL below with "westus".
        this.uriBase = `https://${process.env.AMS_DEPLOYMENT_LOCATION}.api.cognitive.microsoft.com/vision/v2.0/`;
        this.body = `{"url":"${fileDownloadURL}"}`;
        this.headers = {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        };
        return Promise.all([this.getImageAnalysis(), this.getTextExtractions()]);
    }

    static async makeCognitionServicesCall(options: Options) {
        return new Promise((resolve) => {
            request.post(options, (error, response, body) => {
                if (error) {
                    Logger.logError(`Error while making Microsoft call: ${error}`);
                    throw new Error(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }

    static async getImageAnalysis() {
        Logger.logInfo('Uploading file to Microsoft Computer Vision Image Analysis');

        // Request parameters.
        const params = {
            // Categories are provided from the following taxonomy - https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/category-taxonomy
            // Description describes the image content with a complete sentence in supported languages, and provides caption.
            // Not detecting Faces (age,gender,faceRectangle) numbers, ImageType(clipArtType, lineDrawingType) scores, or Color
            visualFeatures: 'Categories,Description,Tags',
            details: 'Celebrities,Landmarks',
            language: 'en'
        };

        const options = {
            uri: `${this.uriBase}/analyze`,
            qs: params,
            body: this.body,
            headers: this.headers
        };

        return this.makeCognitionServicesCall(options);
    }

    static async getTextExtractions() {
        Logger.logInfo('Uploading file to Microsoft Computer Vision Text Extraction');

        // Request parameters.
        const params = {
            language: 'unk',
            // detect the text orientation in the image. With detectOrientation=true the OCR service tries
            // to detect the image orientation and correct it before further processing (e.g. if it's upside-down).
            detectOrientation: true
        };

        const options = {
            uri: `${this.uriBase}/ocr`,
            qs: params,
            body: this.body,
            headers: this.headers
        };
        return this.makeCognitionServicesCall(options);
    }
}

/** @module image-ams-computer-vision/microsoft/text-extraction */
module.exports = ComputerVision;
