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

const GRAPHQL_ENDPOINT = process.env.API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT;
const BUCKET_NAME = process.env.STORAGE_S3SPYPICSSTORAGEPHOTOS20230501_BUCKETNAME;
const AWS_REGION = process.env.REGION;

async function createRequest(query, variables) {
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
  return new Request(GRAPHQL_ENDPOINT, signed);
}

async function getPhoto(photoId) {
  const getPhotoQuery = /* GraphQL */ `query GetPhoto($id: ID!) {
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
      session_id
      latitude
      longitude
      altitude
      width
      height
      size
      content_type
      user_id
      user {
        username
        name
        bio
        country
        stripe_account_id
      }
      createdAt
      updatedAt
    }
  }`;

  const variables = {
    id: photoId
  };

  const request = await createRequest(getPhotoQuery, variables);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.getPhoto;
  } catch (error) {
    return null;
  }
}

async function getUser(userId) {
  const query = /* GraphQL */ `query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      name
      bio
      date_of_birth
      address
      post_code
      city
      phone
      cardholder_name
      country
      bank_number
      stripe_account_id
      createdAt
      updatedAt
    }
  }`;

  const variables = {
    id: userId
  };

  const request = await createRequest(query, variables);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.getUser;
  } catch (error) {
    return null;
  }
}

async function setSessionIdForPhoto(photoId, sessionId) {
  const query = /* GraphQL */ `mutation UpdatePhoto(
    $input: UpdatePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    updatePhoto(input: $input, condition: $condition) {
      id
      session_id
    }
  }`;

  const variables = {
    input: {
      id: photoId,
      session_id: sessionId
    }
  };

  const request = await createRequest(query, variables);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.updatePhoto;
  } catch (error) {
    return null;
  }
}

async function updateUserPaymentInfo(id, bank_number, stripe_account_id) {
  const query = /* GraphQL */ `mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      country
      bank_number
      stripe_account_id
      createdAt
      updatedAt
    }
  }`;

  const variables = {
    input: {
      id,
      bank_number,
      stripe_account_id
    },
  };

  const request = await createRequest(query, variables);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.updateUser;
  } catch (error) {
    return null;
  }
}

async function updateStripId(id, stripe_account_id) {
  const query = /* GraphQL */ `mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      stripe_account_id
      country
      createdAt
      updatedAt
    }
  }`;

  const variables = {
    input: {
      id,
      stripe_account_id
    },
  };

  const request = await createRequest(query, variables);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.updateUser;
  } catch (error) {
    return null;
  }
}

async function setSoldAt(photoId) {
  const query = /* GraphQL */ `mutation UpdatePhoto(
    $input: UpdatePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    updatePhoto(input: $input, condition: $condition) {
      id
      sold_at
    }
  }`;

  const variables = {
    input: {
      id: photoId,
      sold_at: new Date().toISOString()
    }
  };

  const request = await createRequest(query, variables);

  try {
    const response = await fetch(request);
    const json = await response.json();
    return json.data.updatePhoto;
  } catch (error) {
    return null;
  }
}

async function getCheckoutLink(env, args, request) {
  const stripe = require('stripe')(env.STRIPE_API_KEY);
  const photoId = args.id;
  const photo = await getPhoto(photoId);
  if (!photo.user || !photo.user.stripe_account_id) {
    return JSON.stringify({
      error: true,
      message: 'Stripe account is missing for this user',
      user: photo.user
    });
  }

  if (photo.session_id) {
    const session = await stripe.checkout.sessions.retrieve(photo.session_id);
    if (session.status === 'open') {
      return JSON.stringify({
        type: 'checkout_link_open',
        url: session.url
      });
    }

    if (session.status === 'complete') {
      return JSON.stringify({
        type: 'already_sold',
      });
    }
  }

  const photoPrice = (photo.price * 100);
  const fivePercent = photoPrice * 0.05;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: photoId,
          },
          unit_amount: photoPrice,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: fivePercent,
      transfer_data: {
        destination: photo.user.stripe_account_id,
      },
    },
    mode: 'payment',
    success_url: `${request.headers.referer}success/${photoId}`,
    cancel_url: `${request.headers.referer}failed/${photoId}`,
  });

  console.info('Stripe Session:\n' + JSON.stringify(session, null, 2));
  await setSessionIdForPhoto(photoId, session.id);

  return JSON.stringify({
    type: 'checkout_link',
    url: session.url
  });
}

async function getPaymentStatus(env, args, request) {
  if (!args.id) {
    return JSON.stringify({
      error: true,
      message: 'id is required'
    });
  }

  const photo = await getPhoto(args.id);
  if (!photo.session_id) {
    return JSON.stringify({
      type: 'redirect_to_buy',
      url: `${request.headers.referer}buy/${photo.id}`
    });
  }

  const stripe = require('stripe')(env.STRIPE_API_KEY);
  const session = await stripe.checkout.sessions.retrieve(photo.session_id);
  if (session.status === 'expired') {
    return JSON.stringify({
      type: 'expired',
      url: `${request.headers.referer}buy/${photo.id}`
    });
  }

  if (session.status === 'open') {
    return JSON.stringify({
      type: 'checkout_link_open',
      url: session.url
    });
  }

  const soldPhoto = await setSoldAt(photo.id);
  console.info('Sold Photo:\n' + JSON.stringify(soldPhoto, null, 2));

  return JSON.stringify({
    type: 'success',
    photo: soldPhoto,
    message: 'Payment was successful'
  });
}

async function getAccountLinkForUser(stripe, stripe_account_id, referer) {
  return await stripe.accountLinks.create({
    account: stripe_account_id,
    refresh_url: `${referer}dashboard/profile`,
    return_url: `${referer}dashboard/profile`,
    type: 'account_onboarding',
  });

}

async function activateMonetization(env, args, request) {
  const Stripe = require('stripe');
  const stripe = Stripe(env.STRIPE_API_KEY);

  const account = await stripe.accounts.create({
    type: 'custom',
    business_type: 'individual',
    country: args.country,
    email: args.username,
    capabilities: {
      card_payments: {requested: true},
      transfers: {requested: true},
    },
    business_profile: {
      mcc: '7829',
      'url': 'www.spypics.at'
    },
    individual: {
      first_name: '',
      last_name: '',
      email: null,
      phone: null,
      dob: {
        day: 0,
        month: 0,
        year: 0
      },
      address: {
        line1: null,
        postal_code: null,
        city: null,
      }
    },
    tos_acceptance: {
      date: Math.floor(new Date().getTime() / 1000),
      ip: '8.8.8.8',
    },
  });

  try {
    const user = await updateUserPaymentInfo(args.id, args.bank_number, account.id);
    console.log(user);
    return JSON.stringify({
      stripe_account_id: user.stripe_account_id,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error(error);
    return JSON.stringify(error);
  }
}

async function activateStripeExpress(env, args, request) {
  const stripe = require('stripe')(env.STRIPE_API_KEY);
  if (!args.id) {
    return JSON.stringify({
      error: true,
      message: 'id is required'
    });
  }

  const user = await getUser(args.id);
  if (!user.name) {
    return JSON.stringify({
      error: true,
      message: 'name is required'
    });
  }

  if (!user.country) {
    return JSON.stringify({
      error: true,
      message: 'country is required'
    });
  }

  try {
    if (!user.stripe_account_id) {
      const names = user.name.split(' ').filter(Boolean);
      const account = await stripe.accounts.create({
        country: user.country,
        email: user.username,
        type: 'express',
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
        business_type: 'individual',
        business_profile: {
          url: 'https://spypics.at',
        },
        individual: {
          first_name: names[0],
          last_name: names.slice(1).join(' '),
          email: user.username,
        },
        metadata: {
          id: user.id
        },
      });
      console.info('Stripe Account:\n' + JSON.stringify(account, null, 2));

      const updatedUser = await updateStripId(user.id, account.id);
      Object.assign(user, updatedUser);
    }

    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    if (account.charges_enabled) {
      const loginLink = await stripe.accounts.createLoginLink(user.stripe_account_id);
      return JSON.stringify({
        type: 'login_link',
        url: loginLink.url
      });
    }

    const accountLink = await getAccountLinkForUser(stripe, user.stripe_account_id, request.headers.referer);
    // console.log('User', user);
    return JSON.stringify({
      type: 'account_link',
      url: accountLink.url
    });
  } catch (error) {
    console.error(error);
    return JSON.stringify(error);
  }
}

async function downloadImage(env, args, request) {
  try {
    const s3 = new aws.S3();
    const photo = await getPhoto(args.id);
    console.log(photo);
    const params = {
      Bucket: photo.original.bucket,
      Key: photo.original.key
    };


    return await s3.getObject(params).promise();
  } catch (error) {
    console.error(JSON.stringify(error));
    console.error('An error occurred');
    return error;
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {Parameters} = await (new aws.SSM()).getParameters({
    Names: ['STRIPE_API_KEY'].map(secretName => process.env[secretName]),
    WithDecryption: true,
  }).promise();

  const env = {
    STRIPE_API_KEY: Parameters[0].Value
  };

  switch (event.fieldName) {
    case 'getCheckoutLink':
      return await getCheckoutLink(env, event.arguments, event.request);

    case 'getPaymentStatus':
      return await getPaymentStatus(env, event.arguments, event.request);

    case 'activateMonetization':
      return await activateMonetization(env, event.arguments, event.request);

    case 'activateStripeExpress':
      return await activateStripeExpress(env, event.arguments, event.request);

    case 'downloadImage':
      return await downloadImage(env, event.arguments, event.request);

    default:
      return JSON.stringify({
        message: 'Method not found'
      });
  }
};
