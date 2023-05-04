import { defineStore } from 'pinia';
import awsExports from '@/aws-exports';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createPhoto as createPhotoMutation } from '@/graphql/mutations';
import { listPhotos as listPhotosQuery } from '@/graphql/queries';
import { v4 as uuidv4 } from 'uuid';
import { useAuthenticator } from '@aws-amplify/ui-vue';

const auth = useAuthenticator();

export const usePhotosStore = defineStore('photos', {
  state: () => {
    return {
      photos: []
    };
  },
  // getters: {
  //   all: (state) => state.photos,
  // },
  actions: {
    async createPhoto(data) {
      const {
        aws_user_files_s3_bucket_region: region,
        aws_user_files_s3_bucket: bucket
      } = awsExports;
      const {file} = data;
      const mimeType = file.type || 'image/jpeg';
      // const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      const photoId = uuidv4();
      const key = `${auth.user.username}/${photoId}.jpg`;
      const inputData = {
        id: photoId,
        user_id: auth.user.username,
        content_type: mimeType,
        original: {
          key,
          region,
          bucket
        },
        ready_for_sell: false
      };

      //s3 bucket storage add file to it
      try {
        await Storage.put(key, file, {
          level: 'protected',
          contentType: mimeType,
          metadata: {user_id: auth.user.username, photo_id: photoId}
        });
        await API.graphql(graphqlOperation(createPhotoMutation, {input: inputData}));

        return Promise.resolve('success');
      } catch (error) {
        console.log('createPhoto error', error);
        return Promise.reject(error);

      }
    },
    async fetchPhotos() {
      const response = await API.graphql({
        query: listPhotosQuery
      });

      this.photos = response.data.listPhotos.items.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
    }
  },
});
