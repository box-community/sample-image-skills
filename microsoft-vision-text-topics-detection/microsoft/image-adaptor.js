/**
 * @fileoverview ImageAdaptor class implementation.
 * ImageAdaptor is used convert the Microsoft vision API result to the standardized metadata v2 cards.
 */

type Tag = {
    confidence: number,
    name: string
};

type Category = {
    score: number,
    name: string,
    detail: ?Object
};

type ImageAnalysis = {
    categories: ?Array<Category>,
    description: ?{
        captions: ?Array<Object>
    },
    tags: ?Array<Tag>
};

type Word = {
    text: string
};

type Line = {
    words: ?Array<Word>
};

type Region = {
    lines: ?Array<Line>
};

type TextExtractions = {
    regions: ?Array<Region>
};
// @flow
let skillsWriter;

const categoryMappings = {
    '': 'text',
    mag: 'magazine',
    sign: 'logo'
};

class ImageAdaptor {
    /**
     * Helper function to format category names found by the Microsoft Cloud Vision API
     * @param {string} name - category name
     * @return {string} correctly formatted category name
     */
    static formatCategoryName(name: string) {
        const splitName = name.split('_');
        if (splitName[0] === 'text') {
            return categoryMappings[splitName[1]] || splitName[1];
        }
        if (splitName[0] === 'trans') {
            return splitName[1];
        }
        return splitName.join(' ').trim();
    }

    /**
     * Helper function to format the entity (categories, landmark, celebrity, tags and captions) found by the Microsoft Cloud Vision API
     * into image text and caption cards
     * @param {string} annotationImageResponse - the classifications found by the Cloud Vision API in JSON format
     * @return {Object} keyword metdata card
     */
    static getKeywordCards(imageAnalysis: ImageAnalysis) {
        const { categories, description, tags } = imageAnalysis;
        let categoryEntries = [];
        let landmarkEntries = [];
        let celebrityEntries = [];
        let tagEntries = [];
        let captionEntries = [];
        if (categories) {
            categoryEntries = categories.filter((category) => category.score > 0.6).map((category) => ({
                text: this.formatCategoryName(category.name)
            }));
            categories.filter((category) => category.detail).forEach((category) => {
                const {
                    detail: { celebrities, landmarks }
                } = category;
                if (celebrities) {
                    celebrityEntries = celebrities.filter((celebrity) => celebrity.confidence > 0.6).map((celebrity) => ({
                        text: celebrity.name
                    }));
                }
                if (landmarks) {
                    landmarkEntries = landmarks.filter((landmark) => landmark.confidence > 0.6).map((landmark) => ({
                        text: landmark.name
                    }));
                }
            });
        }
        if (tags) {
            tagEntries = tags.filter((tag) => tag.confidence > 0.6).map((tag) => ({
                text: tag.name
            }));
        }
        if (description) {
            if (description.captions) {
                captionEntries = description.captions.filter((caption) => caption.confidence > 0.6).map((caption) => ({
                    text: caption.text
                }));
            }
        }

        const keywordData = categoryEntries
            .concat(tagEntries)
            .concat(landmarkEntries)
            .concat(celebrityEntries);
        return [
            skillsWriter.createTopicsCard(keywordData),
            skillsWriter.createTranscriptsCard(captionEntries, null, 'Caption')
        ];
    }

    /**
     * Helper function to format the entity (label and logo) annotations found by the Microsoft Cloud Vision API
     * @param {string} annotationImageResponse - the classifications found by the Cloud Vision API in JSON format
     * @return {Object} keyword metdata card
     */
    static getTranscriptCard(textExtractions: TextExtractions) {
        const { regions = [] } = textExtractions;
        const transcriptData = [];
        regions.forEach((region) => {
            const { lines = [] } = region;
            lines.forEach((line) => {
                const { words = [] } = line;
                const sentence = [];
                words.forEach((word) => {
                    sentence.push(word.text);
                });
                transcriptData.push({
                    text: sentence.join(' ')
                });
            });
        });
        return skillsWriter.createTranscriptsCard(transcriptData, null, 'Image Text');
    }

    /**
     * Helper function to format the entity (label and logo) annotations found by the Microsoft Cloud Vision API
     * @param {BoxSdk} client to access Metadata card template
     * @param {string} annotationImageResponse - the classifications found by the Cloud Vision API in JSON format
     * @param {string} id - box request id
     * @param {string} skillId - box-skill-ams-image-node
     * @return {Array} - array of metdata cards
     */
    static getSkillMetadataCards(
        skillsWriterParam: Object,
        imageAnalysis: ImageAnalysis,
        textExtractions: TextExtractions
    ) {
        skillsWriter = skillsWriterParam;
        return [...this.getKeywordCards(imageAnalysis), this.getTranscriptCard(textExtractions)];
    }
}

/** @module image-ams-vision-nodejs/microsoft/image-adaptor */
module.exports = ImageAdaptor;
