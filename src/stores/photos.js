import { defineStore } from 'pinia';
import awsExports from '@/aws-exports';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import {
  createPhoto as createPhotoMutation,
  updatePhoto as updatePhotoMutation,
  deletePhoto as deletePhotoMutation
} from '@/graphql/mutations';
import { onUpdatePhoto } from '@/graphql/subscriptions';
import { getPhoto, listPhotos as listPhotosQuery } from '@/graphql/queries';
import { v4 as uuidv4 } from 'uuid';
import { useAuthenticator } from '@aws-amplify/ui-vue';

const auth = useAuthenticator();


export const usePhotosStore = defineStore('photos', {
  state: () => {
    // const sub = API.graphql(
    //   graphqlOperation(onUpdatePhoto)
    // ).subscribe({
    //   next: ({provider, value}) => console.log({provider, value}),
    //   error: error => console.warn(error)
    // });

    return {
      photos: [],
      activePhoto: null
    };
  },
  actions: {
    async createPhoto(data) {
      const {
        aws_user_files_s3_bucket_region: region,
        aws_user_files_s3_bucket: bucket
      } = awsExports;
      const {file} = data;
      const mimeType = file.type || 'image/jpeg';
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
        price: data.price ? data.price : 0,
        ready_for_sell: data.ready_for_sell
      };

      //s3 bucket storage add file to it
      try {
        await Storage.put(key, file, {
          level: 'protected',
          contentType: mimeType,
          metadata: {user_id: auth.user.username, photo_id: photoId}
        });
        const response = await API.graphql(graphqlOperation(createPhotoMutation, {input: inputData}));
        if (response.data.createPhoto) {
          this.$patch((state) => {
            state.photos.unshift(response.data.createPhoto);
            state.hasChanged = true;
          });
        }
        return Promise.resolve('success');
      } catch (error) {
        console.log('createPhoto error', error);
        return Promise.reject(error);

      }
    },
    async updatePhoto(data) {
      const inputData = {
        id: data.id,
        original: data.original,
        price: data.price ? data.price : 0,
        ready_for_sell: data.ready_for_sell
      };

      try {
        const response = await API.graphql(graphqlOperation(updatePhotoMutation, {input: inputData}));
        this.activePhoto = response.data.updatePhoto;

        const found = this.photos.find(photo => photo.id === this.activePhoto.id);
        if (found) {
          Object.assign(found, this.activePhoto);
        }

        return Promise.resolve('success');
      } catch (error) {
        console.log('createPhoto error', error);
        return Promise.reject(error);
      }
    },

    async deletePhoto(id) {
      const inputData = {
        id: id
      };

      try {
        const key = `${auth.user.username}/${id}.jpg`;
        const thumbnailKey = `thumbnails/${id}.jpg`;
        await Storage.remove(key, {
          level: 'protected'
        });
        await Storage.remove(thumbnailKey, {
          level: 'public'
        });
        const response = await API.graphql(graphqlOperation(deletePhotoMutation, {input: inputData}));

        if (this.activePhoto && response.data.deletePhoto.id === this.activePhoto.id) {
          this.$patch((state) => {
            const index = state.photos.findIndex(photo => photo.id === state.activePhoto.id);
            if (index !== -1) {
              state.photos.splice(index, 1);
            }
            state.activePhoto = null;

            state.hasChanged = true;
          });
        }

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
    },
    async fetchPhotoById(id) {
      const response = await API.graphql({
        query: getPhoto,
        variables: {
          id
        }
      });

      this.$patch((state) => {
        state.activePhoto = response.data.getPhoto;
      });
    }
  },
});
