/* Amplify Params - DO NOT EDIT
	API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT
	API_SPYPICS_GRAPHQLAPIIDOUTPUT
	API_SPYPICS_GRAPHQLAPIKEYOUTPUT
	AUTH_SPYPICS_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_SPYPICS_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_SPYPICS_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id,
    username
  }
}`;

export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  if (event.request.userAttributes.email && event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const variables = {
      input: {
        id: event.request.userAttributes.sub,
        username: event.request.userAttributes.email
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

    console.log(`postSignUpTrigger: ${statusCode} ${JSON.stringify(body)}`);
  }

  return event;
};

