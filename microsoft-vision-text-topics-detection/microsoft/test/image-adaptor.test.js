const ImageAdaptor = require('../image-adaptor');
const { SkillsWriter } = require('./box/skills-kit-2.1');

describe('ImageAdaptor', () => {
    const boxId = '123';
    const skillId = 'mockSkillId';
    const fileId = 'mockfileId';
    const writeToken = 'mockWriteToken';
    const skillsWriter = new SkillsWriter({ requestId: boxId, skillId, fileId, fileWriteToken: writeToken });

    test('getSkillMetadataCards()', () => {
        const mockDateValue = new Date().toISOString();

        const imageAnalysisResponse = {
            categories: [
                {
                    name: 'people_',
                    score: 0.86328125,
                    detail: {
                        celebrities: [
                            {
                                name: 'Satya Nadella',
                                faceRectangle: {
                                    left: 240,
                                    top: 294,
                                    width: 135,
                                    height: 135
                                },
                                confidence: 0.99999558925628662
                            }
                        ],
                        landmarks: null
                    }
                },
                {
                    name: 'building_',
                    score: 0.903125,
                    detail: {
                        landmarks: [
                            {
                                name: 'Mount Fuji',
                                confidence: 0.9858176112174988
                            }
                        ]
                    }
                },
                {
                    name: 'outdoor_',
                    score: 0.81171875,
                    detail: {
                        landmarks: [
                            {
                                name: 'Mount Fuji',
                                confidence: 0.9858176112174988
                            }
                        ]
                    }
                }
            ],
            description: {
                tags: [
                    'photo',
                    'smiling',
                    'window',
                    'posing',
                    'young',
                    'man',
                    'standing',
                    'holding',
                    'wearing',
                    'woman',
                    'white'
                ],
                captions: [
                    {
                        text: 'Maya Angelou smiling for the camera',
                        confidence: 0.7358882636973613
                    }
                ]
            },
            tags: [
                { name: 'train', confidence: 0.9975446 },
                { name: 'platform', confidence: 0.995543063 },
                { name: 'station', confidence: 0.9798007 },
                { name: 'indoor', confidence: 0.927719653 },
                { name: 'subway', confidence: 0.838939846 },
                { name: 'pulling', confidence: 0.431715637 }
            ],
            requestId: '4192300b-7d44-437a-b88d-614f933e890b',
            metadata: {
                height: 2400,
                width: 2400,
                format: 'Jpeg'
            }
        };

        const textExtractionResponse = {
            language: 'en',
            orientation: 'NotDetected',
            textAngle: 0,
            regions: [
                {
                    boundingBox: '125,1686,2216,644',
                    lines: [
                        {
                            boundingBox: '128,1686,1986,118',
                            words: [
                                {
                                    boundingBox: '128,1686,298,93',
                                    text: 'what'
                                },
                                {
                                    boundingBox: '464,1713,214,91',
                                    text: 'you'
                                },
                                {
                                    boundingBox: '726,1686,269,108',
                                    text: 'said,'
                                },
                                {
                                    boundingBox: '1048,1686,397,117',
                                    text: 'people'
                                },
                                {
                                    boundingBox: '1490,1686,214,92',
                                    text: 'will'
                                },
                                {
                                    boundingBox: '1749,1686,365,118',
                                    text: 'forget'
                                }
                            ]
                        },
                        {
                            boundingBox: '125,1851,2146,119',
                            words: [
                                {
                                    boundingBox: '125,1851,298,94',
                                    text: 'what'
                                },
                                {
                                    boundingBox: '461,1879,213,91',
                                    text: 'you'
                                },
                                {
                                    boundingBox: '723,1851,212,109',
                                    text: 'did,'
                                },
                                {
                                    boundingBox: '988,1851,199,94',
                                    text: 'but'
                                },
                                {
                                    boundingBox: '1229,1851,397,117',
                                    text: 'people'
                                },
                                {
                                    boundingBox: '1671,1851,214,93',
                                    text: 'will'
                                },
                                {
                                    boundingBox: '1930,1879,341,66',
                                    text: 'never'
                                }
                            ]
                        },
                        {
                            boundingBox: '141,2024,1977,118',
                            words: [
                                {
                                    boundingBox: '141,2024,366,118',
                                    text: 'forget'
                                },
                                {
                                    boundingBox: '549,2024,248,93',
                                    text: 'how'
                                },
                                {
                                    boundingBox: '835,2051,214,91',
                                    text: 'you'
                                },
                                {
                                    boundingBox: '1095,2024,323,93',
                                    text: 'made'
                                },
                                {
                                    boundingBox: '1465,2024,305,93',
                                    text: 'them'
                                },
                                {
                                    boundingBox: '1814,2024,304,93',
                                    text: 'feel."'
                                }
                            ]
                        },
                        {
                            boundingBox: '1288,2212,1053,118',
                            words: [
                                {
                                    boundingBox: '1288,2216,149,88',
                                    text: 'Dr'
                                },
                                {
                                    boundingBox: '1480,2216,325,114',
                                    text: 'Maya'
                                },
                                {
                                    boundingBox: '1844,2212,497,118',
                                    text: 'Angelou'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const cards = [
            {
                created_at: mockDateValue,
                entries: [
                    { text: 'people', type: 'text' },
                    { text: 'building', type: 'text' },
                    { text: 'outdoor', type: 'text' },
                    { text: 'train', type: 'text' },
                    { text: 'platform', type: 'text' },
                    { text: 'station', type: 'text' },
                    { text: 'indoor', type: 'text' },
                    { text: 'subway', type: 'text' },
                    { text: 'Mount Fuji', type: 'text' },
                    { text: 'Satya Nadella', type: 'text' }
                ],
                invocation: { id: '123', type: 'skill_invocation' },
                skill: { id: 'mockSkillId', type: 'service' },
                skill_card_title: { code: 'skills_topics', message: 'Topics' },
                skill_card_type: 'keyword',
                status: {},
                type: 'skill_card'
            },

            {
                created_at: mockDateValue,
                entries: [{ text: 'Maya Angelou smiling for the camera', type: 'text' }],
                invocation: { id: '123', type: 'skill_invocation' },
                skill: { id: 'mockSkillId', type: 'service' },
                skill_card_title: { code: 'skills_caption', message: 'Caption' },
                skill_card_type: 'transcript',
                status: {},
                type: 'skill_card'
            },

            {
                created_at: mockDateValue,
                entries: [
                    { text: 'what you said, people will forget', type: 'text' },
                    { text: 'what you did, but people will never', type: 'text' },
                    { text: 'forget how you made them feel."', type: 'text' },
                    { text: 'Dr Maya Angelou', type: 'text' }
                ],
                invocation: { id: '123', type: 'skill_invocation' },
                skill: { id: 'mockSkillId', type: 'service' },
                skill_card_title: { code: 'skills_image_text', message: 'Image Text' },
                skill_card_type: 'transcript',
                status: {},
                type: 'skill_card'
            }
        ];

        expect.assertions(1);
        const data = ImageAdaptor.getSkillMetadataCards(skillsWriter, imageAnalysisResponse, textExtractionResponse);
        data.forEach(card => {
            // eslint-disable-next-line no-param-reassign
            card.created_at = mockDateValue;
        });
        expect(data).toEqual(cards);
    });
    test('formatCategoryName()', () => {
        expect(ImageAdaptor.formatCategoryName('_')).toEqual('');
        expect(ImageAdaptor.formatCategoryName('trans_')).toEqual('');
        expect(ImageAdaptor.formatCategoryName('trans_car')).toEqual('car');
        expect(ImageAdaptor.formatCategoryName('people_swimming')).toEqual('people swimming');
        expect(ImageAdaptor.formatCategoryName('text_swimming')).toEqual('swimming');
        expect(ImageAdaptor.formatCategoryName('text_sign')).toEqual('logo');
        expect(ImageAdaptor.formatCategoryName('text_')).toEqual('text');
    });
});
