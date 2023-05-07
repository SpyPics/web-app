/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["STRIPE_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT
	API_SPYPICS_GRAPHQLAPIIDOUTPUT
	API_SPYPICS_GRAPHQLAPIKEYOUTPUT
	API_SPYPICS_PHOTOTABLE_ARN
	API_SPYPICS_PHOTOTABLE_NAME
	API_SPYPICS_USERTABLE_ARN
	API_SPYPICS_USERTABLE_NAME
	ENV
	REGION
	STORAGE_S3SPYPICSSTORAGEPHOTOS20230501_BUCKETNAME
Amplify Params - DO NOT EDIT */
const aws = require('aws-sdk');
const {Sha256} = require('@aws-crypto/sha256-js');
const {defaultProvider} = require('@aws-sdk/credential-provider-node');
const {SignatureV4} = require('@aws-sdk/signature-v4');
const {HttpRequest} = require('@aws-sdk/protocol-http');
const {default: fetch, Request} = require('node-fetch');
const Stripe = require('stripe');

const GRAPHQL_ENDPOINT = process.env.API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT;
const BUCKET_NAME = process.env.STORAGE_S3SPYPICSSTORAGEPHOTOS20230501_BUCKETNAME;
const AWS_REGION = process.env.REGION;

const bucketURL = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;

const query = /* GraphQL */ `query GetPhoto($id: ID!) {
  getPhoto(id: $id) {
    id
    original {
      bucket
      key
      region
    }
    description
    ready_for_sell
    price
    permalink
    sold_at
    latitude
    longitude
    altitude
    width
    height
    size
    content_type
    user_id
    createdAt
    updatedAt
  }
}`;

async function getPhoto(id) {
  const variables = {
      id
  };

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify({query, variables}),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(GRAPHQL_ENDPOINT, signed);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.getPhoto;
  } catch (error) {
    return null;
  }
}

async function makeProduct(stripe, photo) {
  return await stripe.products.create({
    name: photo.id,
    images: [
      `${bucketURL}/${photo.id}`
    ]
  });
}

async function makePrice(stripe, photo) {
  return await stripe.prices.create({
    unit_amount: photo.price,
    currency: 'eur',
    // product: {
    //   name: photo.id,
    //   images: [
    //     `${bucketURL}/${photo.id}`
    //   ]
    // },
    product_data: {
      name: photo.id
    },
  });
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const {Parameters} = await (new aws.SSM())
    .getParameters({
      Names: ['STRIPE_API_KEY'].map(secretName => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();
  const STRIPE_API_KEY = Parameters[0].Value;
  const stripe = Stripe(STRIPE_API_KEY);
  const photoId = event.arguments.id;

  const photo = await getPhoto(photoId);
  console.log(photo)
  // const product = await makeProduct(stripe, photo);
  // const product = await makePrice(stripe, photo);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: photoId,
          },
          unit_amount: (photo.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://google.com',
    cancel_url: 'https://youtube.com',
  });

  console.log(session);
  return session.url;
};
