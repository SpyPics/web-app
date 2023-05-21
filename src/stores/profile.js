import { defineStore } from 'pinia';
import { Auth, API } from 'aws-amplify';
import { activateMonetization as activateMonetizationMutation } from '@/graphql/mutations.js';
import { activateStripeExpress as activateStripeExpressMutation } from '@/graphql/mutations.js';


export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      id: null,
      username: null,
      name: null,
      bio: null,
      date_of_birth: null,
      address: null,
      post_code: null,
      city: null,
      phone: null,
      cardholder_name: null,
      country: null,
      bank_number: null,
      stripe_account_id: null
    };
  },
  actions: {
    async fetch() {
      const user = await Auth.currentAuthenticatedUser();
      const getUserQuery = /* GraphQL */ `query GetUser($id: ID!) {
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
      const response = await API.graphql({
        query: getUserQuery,
        variables: {
          id: user.username
        }
      });

      this.$patch((state) => {
        Object.assign(state, response.data.getUser);
      });
    },

    async save() {
      const updateUserMutation = /* GraphQL */ `mutation UpdateUser(
        $input: UpdateUserInput!
        $condition: ModelUserConditionInput
      ) {
        updateUser(input: $input, condition: $condition) {
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

      const response = await API.graphql({
        query: updateUserMutation,
        variables: {
          input: {
            id: this.id,
            name: this.name,
            bio: this.bio,
            date_of_birth: this.date_of_birth,
            address: this.address,
            post_code: this.post_code,
            city: this.city,
            phone: this.phone,
            cardholder_name: this.cardholder_name,
            country: this.country,
            bank_number: this.bank_number
          }
        }
      });

      this.$patch((state) => {
        Object.assign(state, response.data.updateUser);
      });
    },

    async activateMonetization() {
      const response = await API.graphql({
        query: activateMonetizationMutation,
        variables: {
          id: this.id,
          username: this.username,
          name: this.name,
          date_of_birth: this.date_of_birth,
          address: this.address,
          post_code: this.post_code,
          city: this.city,
          phone: this.phone,
          cardholder_name: this.cardholder_name,
          country: this.country,
          bank_number: this.bank_number
        }
      });

      this.$patch((state) => {
        Object.assign(state, JSON.parse(response.data.activateMonetization));
      });
    },

    async activateStripeExpress() {
      const response = await API.graphql({
        query: activateStripeExpressMutation,
        variables: {
          id: this.id,
          username: this.username,
          country: this.country,
        }
      });

      return JSON.parse(response.data.activateStripeExpress);
    }
  }
});
