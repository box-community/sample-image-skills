/**
 * @fileoverview ImageAdaptor class implementation.
 */

type Annotation = {
    mid: string,
    locale: string,
    description: string,
    score: number,
    confidence: number,
    topicality: number,
    boundingPoly: ?Object,
    locations: Array,
    properties: Array
};
type AnnotationImageResponse = { labelAnnotations: Array<Annotation>, fullTextAnnotation: ?Object };

/**
 * ImageAdaptor is used convert the Google vision API result to the standardized metadata v2 cards.
 */
// @flow
let skillsWriter;

class ImageAdaptor {
    /**
     * Helper function to format the entity (label and logo) annotations found by the Google Cloud Vision API
     * @param {string} annotationImageResponse - the classifications found by the Cloud Vision API in JSON format
     * @return {Object} keyword metdata card
     */
    static getKeywordCard(logoAnnotations: ?Array<Object>, labelAnnotations: Array<Annotation>) {
        let logoEntries = [];
        let labelEntries = [];

        if (logoAnnotations) {
            logoEntries = logoAnnotations
                .filter((logoAnns) => logoAnns.score > 0.6)
                .map((logoAnns) => ({
                    type: 'text',
                    text: logoAnns.description
                }));
        }

        if (labelAnnotations) {
            labelEntries = labelAnnotations
                .filter((labelAnns) => labelAnns.score > 0.6)
                .map((labelAnns) => ({
                    type: 'text',
                    text: labelAnns.description
                }));
        }
        const keywordData = logoEntries.concat(labelEntries);
        return skillsWriter.createTopicsCard(keywordData);
    }

    /**
     * Helper function to format the entity (label and logo) annotations found by the Google Cloud Vision API
     * @param {string} annotationImageResponse - the classifications found by the Cloud Vision API in JSON format
     *
     * @return {Object} keyword metdata card
     */
    static getTranscriptCard(fullTextAnnotation: ?Object) {
        const transcriptions =
            fullTextAnnotation && fullTextAnnotation.text ? fullTextAnnotation.text.trim('\n').split('\n') : [];
        const transcriptData = transcriptions.map((transcription) => ({
            text: transcription
        }));
        return skillsWriter.createTranscriptsCard(transcriptData, null, 'Image Text');
    }

    /**
     * Helper function to format the entity (label and logo) annotations found by the Google Cloud Vision API
     * @param {BoxSdk} client to access Metadata card template
     * @param {string} annotationImageResponse - the classifications found by the Cloud Vision API in JSON format
     * @param {string} id - box request id
     * @param {string} skillId - box-skill-google-image-node
     * @return {Array} - array of metdata cards
     */
    static getSkillMetadataCards(skillsWriterParam: Object, annotationImageResponse: AnnotationImageResponse) {
        skillsWriter = skillsWriterParam;
        const { logoAnnotations, labelAnnotations, fullTextAnnotation } = annotationImageResponse;
        return [
            ImageAdaptor.getKeywordCard(logoAnnotations, labelAnnotations),
            ImageAdaptor.getTranscriptCard(fullTextAnnotation)
        ];
    }
}

/** @module image-google-vision-nodejs/google/image-adaptor */
module.exports = ImageAdaptor;
