const ImageAdaptor = require('../image-adaptor');
const { SkillsWriter } = require('./box/skills-kit-2.1');

const SKILLS_SERVICE_TYPE = 'service';
const SKILLS_METADATA_CARD_TYPE = 'skill_card';
const SKILLS_METADATA_INVOCATION_TYPE = 'skill_invocation';

describe('ImageAdaptor', () => {
    const mockDateValue = new Date().toISOString();

    const response = {
        faceAnnotations: [],
        landmarkAnnotations: [],
        logoAnnotations: [
            {
                mid: '/m/09cfq',
                locale: '',
                description: 'Pizza',
                score: 0.750984787940979,
                confidence: 0,
                topicality: 0,
                boundingPoly: [Object],
                locations: [],
                properties: []
            }
        ],
        labelAnnotations: [
            {
                mid: '/m/07s6nbt',
                locale: '',
                description: 'text',
                score: 0.9002929329872131,
                confidence: 0,
                topicality: 0.9002929329872131,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/03gq5hm',
                locale: '',
                description: 'font',
                score: 0.843940019607544,
                confidence: 0,
                topicality: 0.843940019607544,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/02n3pb',
                locale: '',
                description: 'product',
                score: 0.8341082334518433,
                confidence: 0,
                topicality: 0.8341082334518433,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/0dwx7',
                locale: '',
                description: 'logo',
                score: 0.8265296816825867,
                confidence: 0,
                topicality: 0.8265296816825867,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/03scnj',
                locale: '',
                description: 'line',
                score: 0.6556208729743958,
                confidence: 0,
                topicality: 0.6556208729743958,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/01cd9',
                locale: '',
                description: 'brand',
                score: 0.6375758051872253,
                confidence: 0,
                topicality: 0.6375758051872253,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/03g09t',
                locale: '',
                description: 'clip art',
                score: 0.6324735879898071,
                confidence: 0,
                topicality: 0.6324735879898071,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/021sdg',
                locale: '',
                description: 'graphics',
                score: 0.6247811913490295,
                confidence: 0,
                topicality: 0.6247811913490295,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/03y18t',
                locale: '',
                description: 'product design',
                score: 0.5900341272354126,
                confidence: 0,
                topicality: 0.5900341272354126,
                boundingPoly: null,
                locations: [],
                properties: []
            },
            {
                mid: '/m/01jwgf',
                locale: '',
                description: 'product',
                score: 0.555600106716156,
                confidence: 0,
                topicality: 0.555600106716156,
                boundingPoly: null,
                locations: [],
                properties: []
            }
        ],
        textAnnotations: [
            {
                mid: '',
                locale: 'en',
                description: 'Pizza',
                score: 0,
                confidence: 0,
                topicality: 0,
                boundingPoly: [Object],
                locations: [],
                properties: []
            },
            {
                mid: '',
                locale: '',
                description: 'Pizza',
                score: 0,
                confidence: 0,
                topicality: 0,
                boundingPoly: [Object],
                locations: [],
                properties: []
            },
            {
                mid: '',
                locale: '',
                description: 'Hut',
                score: 0,
                confidence: 0,
                topicality: 0,
                boundingPoly: [Object],
                locations: [],
                properties: []
            }
        ],
        fullTextAnnotation: { pages: [[Object]], text: 'Pizza\nOther Pizza\n' },
        safeSearchAnnotation: null,
        imagePropertiesAnnotation: { dominantColors: { colors: [Object] } },
        cropHintsAnnotation: { cropHints: [[Object]] },
        webDetection: null,
        error: null
    };

    const keywordCard = {
        created_at: mockDateValue,
        entries: [
            { text: 'Pizza', type: 'text' },
            { text: 'text', type: 'text' },
            { text: 'font', type: 'text' },
            { text: 'product', type: 'text' },
            { text: 'logo', type: 'text' },
            { text: 'line', type: 'text' },
            { text: 'brand', type: 'text' },
            { text: 'clip art', type: 'text' },
            { text: 'graphics', type: 'text' }
        ],
        invocation: { id: '123', type: SKILLS_METADATA_INVOCATION_TYPE },
        skill: { id: 'mockSkillId', type: SKILLS_SERVICE_TYPE },
        skill_card_title: {
            code: 'skills_topics',
            message: 'Topics'
        },
        skill_card_type: 'keyword',
        status: {},
        type: SKILLS_METADATA_CARD_TYPE
    };
    const transcriptCardWithNewLines = {
        created_at: mockDateValue,
        entries: [{ text: 'Pizza', type: 'text' }, { text: 'Other Pizza', type: 'text' }],
        invocation: { id: '123', type: SKILLS_METADATA_INVOCATION_TYPE },
        skill: { id: 'mockSkillId', type: SKILLS_SERVICE_TYPE },
        skill_card_title: {
            code: 'skills_image_text',
            message: 'Image Text'
        },
        skill_card_type: 'transcript',
        status: {},
        type: SKILLS_METADATA_CARD_TYPE
    };
    const transcriptCardWithoutNewLines = {
        created_at: mockDateValue,
        entries: [{ text: 'Pizza', type: 'text' }],
        invocation: { id: '123', type: SKILLS_METADATA_INVOCATION_TYPE },
        skill: { id: 'mockSkillId', type: SKILLS_SERVICE_TYPE },
        skill_card_title: {
            code: 'skills_image_text',
            message: 'Image Text'
        },
        skill_card_type: 'transcript',
        status: {},
        type: SKILLS_METADATA_CARD_TYPE
    };
    const transcriptCardWithNoTranscript = {
        created_at: mockDateValue,
        entries: [],
        invocation: { id: '123', type: SKILLS_METADATA_INVOCATION_TYPE },
        skill: { id: 'mockSkillId', type: SKILLS_SERVICE_TYPE },
        skill_card_title: {
            code: 'skills_image_text',
            message: 'Image Text'
        },
        skill_card_type: 'transcript',
        status: {},
        type: SKILLS_METADATA_CARD_TYPE
    };

    const fileId = 'mockfileId';
    const writeToken = 'mockWriteToken';
    const boxId = '123';
    const skillId = 'mockSkillId';

    const skillsWriter = new SkillsWriter({ requestId: boxId, skillId, fileId, fileWriteToken: writeToken });

    test('getSkillMetadataCards() with new lines in transcription', () => {
        const data = ImageAdaptor.getSkillMetadataCards(skillsWriter, response);
        data.forEach(card => {
            // eslint-disable-next-line no-param-reassign
            card.created_at = mockDateValue;
        });
        expect(data).toEqual([keywordCard, transcriptCardWithNewLines]);
    });

    test('getSkillMetadataCards() with no new lines in transcription', () => {
        response.fullTextAnnotation = { pages: [[Object]], text: 'Pizza', type: 'text' };
        const data = ImageAdaptor.getSkillMetadataCards(skillsWriter, response);
        data.forEach(card => {
            // eslint-disable-next-line no-param-reassign
            card.created_at = mockDateValue;
        });
        expect(data).toEqual([keywordCard, transcriptCardWithoutNewLines]);
    });
    test('getSkillMetadataCards() with no transcription', () => {
        response.fullTextAnnotation = null;
        const data = ImageAdaptor.getSkillMetadataCards(skillsWriter, response);
        data.forEach(card => {
            // eslint-disable-next-line no-param-reassign
            card.created_at = mockDateValue;
        });
        expect(data).toEqual([keywordCard, transcriptCardWithNoTranscript]);
    });
});
