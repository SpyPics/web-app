/* Amplify Params - DO NOT EDIT
	API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT
	API_SPYPICS_GRAPHQLAPIIDOUTPUT
	API_SPYPICS_GRAPHQLAPIKEYOUTPUT
	AUTH_SPYPICS_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { Sha256 } = require("@aws-crypto/sha256-js");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { default: fetch, Request } = require("node-fetch");

const GRAPHQL_ENDPOINT = process.env.API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.REGION;

const query = /* GraphQL */ `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id,
    username
  }
}`;

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  if (event.request.userAttributes.email && event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const variables = {
      input: {
        id: event.request.userAttributes.sub,
        username: event.request.userAttributes.email
      }
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
      body: JSON.stringify({ query,variables }),
      path: endpoint.pathname
    });

    const signed = await signer.sign(requestToBeSigned);
    const request = new Request(GRAPHQL_ENDPOINT, signed);
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

    console.log(`postSignUpTrigger: ${statusCode} ${JSON.stringify(body)}`);
  }

  return event;
};

