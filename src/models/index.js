// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Photo, User, S3Object } = initSchema(schema);

export {
  Photo,
  User,
  S3Object
};