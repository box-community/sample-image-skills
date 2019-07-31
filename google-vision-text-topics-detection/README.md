# Google Vision Image Extraction

This is an Image Box skill that uses the [Google Vision API](https://cloud.google.com/vision/) to extract Topics and OCR (Image Text) from files and write it back to Box as metadata on the file. The ML model for this is provided by the generic images available on Google search, and is not for identifying non-generic object/people names in an image, which may be specific to the internal knowledge of a company.

![screenshot](google-screenshot.png)

## What metadata is extracted?

This Skill:

-   Supporting file types: ai, bmp, gif, eps, heic, jpeg, jpg, png, ps, psd, svg, tif, tiff, dcm, dicm, dicom, svs, tga
-   Supporting file sizes: <10 MB
-   Supporting languages: Automatic language detection.

## Usage

### Prerequisites

-   Make sure to sign up for a [Box Developer](https://developer.box.com/) account and prepare your app for Box skills. See our [developer documentation](https://developer.box.com/docs/box-skills) for more guidance.

### Configuring Serverless

Our Box skills uses the excellent [Serverless framework](https://serverless.com/). This framework allows for deployment to various serverless platforms, but in this example we will use AWS as an example.

To use Serverless, install the NPM module.

```bash
npm install -g serverless
```

Next, follow our guide on [configuring Serverless for AWS](../AWS_CONFIGURATION.md), or any of the guides on [serverless.com](https://serverless.com/) to allow deploying to your favorite serverless provider.

### Deploying

Clone this repo and change into the sample folder.

```bash
git clone https://github.com/box-community/sample-image-skills
cd sample-image-skills/google-vision-text-topics-detection
```

Then simply deploy the Skill using Serverless.

```bash
serverless deploy -v
```

At the end of this, you will have an invocation URL for your Lambda function.

### Set the invocation URL

The final step is to [configure your Box Skill with the invocation URL](https://developer.box.com/docs/configure-a-box-skill) for your Lambda function. You should have received this in the previous, after you deployed the function for the first time.

Once your new skill is called by our code, the Skill usually takes around a few minutes to process and write the new metadata to the file.
