import { defineStore } from 'pinia';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import {
  createPhoto as createPhotoMutation,
  updatePhoto as updatePhotoMutation,
  deletePhoto as deletePhotoMutation
} from '@/graphql/mutations';
import { getPhoto, getPriceList } from '@/graphql/queries';
import { v4 as uuidv4 } from 'uuid';
import awsExports from '@/aws-exports';


export const usePhotosStore = defineStore('photos', {
  state: () => {
    return {
      photos: [],
      activePhoto: null,
      prices: []
    };
  },
  getters: {
    products: (state) => {
      return state.photos.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1).filter(photo => photo.ready_for_sell && !photo.sold_at);
    }
  },
  actions: {
    async createPhoto(data) {
      const user = await Auth.currentAuthenticatedUser();
      const {
        aws_user_files_s3_bucket_region: region,
        aws_user_files_s3_bucket: bucket
      } = awsExports;
      const {file} = data;
      const mimeType = file.type || 'image/jpeg';
      const photoId = uuidv4();
      const key = `${user.username}/${photoId}.jpg`;

      const inputData = {
        id: photoId,
        user_id: user.username,
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
          level: 'public',
          contentType: mimeType,
          metadata: {user_id: user.username, photo_id: photoId}
        });
        const response = await API.graphql(graphqlOperation(createPhotoMutation, {input: inputData}));
        this.$createPatch(response.data.createPhoto);

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
        this.$updatePatch(response.data.updatePhoto);

        return Promise.resolve('success');
      } catch (error) {
        console.log('createPhoto error', error);
        return Promise.reject(error);
      }
    },

    async deletePhoto(id) {
      const user = await Auth.currentAuthenticatedUser();
      const inputData = {
        id: id
      };

      try {
        const key = `${user.username}/${id}.jpg`;
        const thumbnailKey = `thumbnails/${id}.jpg`;
        await Storage.remove(key, {
          level: 'protected'
        });
        await Storage.remove(thumbnailKey, {
          level: 'public'
        });
        const response = await API.graphql(graphqlOperation(deletePhotoMutation, {input: inputData}));
        this.$deletePatch(response.data.deletePhoto);

        return Promise.resolve('success');
      } catch (error) {
        console.log('createPhoto error', error);
        return Promise.reject(error);
      }
    },

    async fetchPhotos() {
      const listPhotosQuery = /* GraphQL */ `query ListPhotos(
        $filter: ModelPhotoFilterInput
        $limit: Int
        $nextToken: String
      ) {
        listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
          items {
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
              id
              username
              name
              bio
              date_of_birth
              address
              post_code
              city
              phone
              country
              cardholder_name
              bank_number
              stripe_account_id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;

      const response = await API.graphql({query: listPhotosQuery});
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
    },

    async fetchPriceList() {
      if (this.prices.length) {
        return;
      }

      const response = await API.graphql({
        query: getPriceList,
        authMode: 'AWS_IAM'
      });

      this.$patch((state) => {
        const json = JSON.parse(response.data.getPriceList);
        state.prices = json.data.sort((a, b) => (a.unit_amount > b.unit_amount) ? 1 : -1);;
      });
    },

    $createPatch(value) {
      this.$patch((state) => {
        const found = state.photos.find(photo => photo.id === value.id);
        if (!found) {
          state.photos.unshift(value);
          state.hasChanged = true;
        }
      });
    },

    $updatePatch(value) {
      this.$patch((state) => {
        const found = state.photos.find(photo => photo.id === value.id);
        if (found && found.updatedAt !== value.updatedAt) {
          Object.assign(found, value);
          state.hasChanged = true;
        }
      });
    },

    $deletePatch(value) {
      this.$patch((state) => {
        if (value.id) {
          const index = state.photos.findIndex(photo => photo.id === value.id);
          if (index !== -1) {
            state.photos.splice(index, 1);
            state.hasChanged = true;
          }
        }
      });
    }
  },
});
