/**
 * @fileoverview GoogleVision class implementation.
 */

/**
 * Module depdencies
 */
// @flow
const GoogleCloudVision = require('@google-cloud/vision');
const Unescape = require('unescape-js');

// An array of all the features we're requesting Google Cloud Vision to return
const features = [
    {
        type: GoogleCloudVision.v1.types.Feature.Type.LABEL_DETECTION
    },
    {
        type: GoogleCloudVision.v1.types.Feature.Type.LOGO_DETECTION
    },
    {
        type: GoogleCloudVision.v1.types.Feature.Type.DOCUMENT_TEXT_DETECTION
    }
];

type GcvKeys = { gcvEmail: string, gcvId: string, gcvKey: string };
/**
 * GoogleVision class provides functions to retrieve annotations from images.
 * It converts the result to the metadata instances and save them in box.
 */
class GoogleVision {
    googleCloudVision: GoogleCloudVision;
    keys: GcvKeys;

    constructor(keys: GcvKeys) {
        const { gcvEmail, gcvId, gcvKey } = keys;

        // Set up access to the Google Cloud Vision API
        this.googleCloudVision = new GoogleCloudVision({
            projectId: gcvId,
            credentials: {
                client_email: gcvEmail,
                private_key: Unescape(gcvKey)
            }
        });
    }

    /**
     * Helper function to pass the contents of the image file to the Google Cloud Vision API to grab the annotations that
     * can be found on the image.
     * @param {string} imageBase64String - base64 encoded image string
     * @return {null} the Promise. It resolves the annotations response. Otherwise rejects with the error.
     */

    getAnnotations(imageBase64String: string) {
        // Send the information of the image

        const request = {
            image: {
                content: imageBase64String
            },
            features
        };
        // Calls the Google vision API
        return this.googleCloudVision.annotateImage(request);
    }
}
/** @module image-google-vision-nodejs/google/vision */
module.exports = GoogleVision;
