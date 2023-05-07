/* Amplify Params - DO NOT EDIT
	API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT
	API_SPYPICS_GRAPHQLAPIIDOUTPUT
	API_SPYPICS_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
import { default as fetch, Request } from 'node-fetch';
import AWS from 'aws-sdk';
import sharp from 'sharp';

const s3 = new AWS.S3();

const GRAPHQL_ENDPOINT = process.env.API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_SPYPICS_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `mutation UpdatePhoto($input: UpdatePhotoInput!) {
  updatePhoto(input: $input) {
    id,
    thumbnail {
      key
    }
  }
}`;


async function loadImage(Bucket, Key) {
  try {
    const params = {
      Bucket,
      Key
    };

    return await s3.getObject(params).promise();
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function createThumbnail(bucket, key, image) {
  // const thumbKey = 'thumbnails/' + key.replace(/\.[^\.]+$/, '.jpg');
  const thumbKey = 'public/thumbnails/' + key;

  try {
    // Use Sharp to resize the image to and convert to JPEG format
    let thumb = await sharp(image).resize(512, 512, {
      fit: 'inside'
    }).jpeg().toBuffer();

    await s3.putObject({
      Bucket: bucket,
      Key: thumbKey,
      Body: thumb,
      ContentType: 'image/jpeg',
      // ACL: 'public-read'
    }).promise();
    return {
      bucket: bucket,
      key: thumbKey,
      region: process.env.REGION
    };
  } catch (error) {
    console.error('[createThumbnail] ', error);
    throw error;
  }
}

async function updatePhotoRecord(photoId, thumbnail) {
  const variables = {
    input: {
      id: photoId,
      thumbnail
    }
  };

  const options = {
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query, variables})
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);
  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) {
      statusCode = 400;
    }
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack
        }
      ]
    };
  }

  return {
    statusCode,
    body
  };
}


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  for (const record of event.Records) {
    if (record.eventName === 'ObjectRemoved:Delete') {
      console.info(`SKIPPED, ObjectRemoved:Delete`);
      return event;
    }

    const bucket = record.s3.bucket.name; //eslint-disable-line
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' ')); //eslint-disable-line
    if (key.indexOf('public/thumbnails/') === 0) {
      console.info(`SKIPPED, ${key}`);
      return event;
    }

    try {
      let image = await loadImage(bucket, key);
      const originalPhotoId = image.Metadata.photo_id;
      if(!originalPhotoId) {
        console.info(`FAILED, originalPhotoId`);
        return event;
      }

      let thumb = await createThumbnail(bucket, originalPhotoId + '.jpg', image.Body);
      // Since the thumbnails are accessible publicly via url, there is no need to save them in the DB
      // `${bucketURL}/public/thumbnails/${photo.id}.jpg`;
      // await updatePhotoRecord(originalPhotoId, thumb);
      console.info(`SUCCESS, ${thumb.key}`);
      return event;
    } catch (error) {
      console.error(JSON.stringify(error));
      console.error('An error occurred');
      return error;
    }
  }
};
