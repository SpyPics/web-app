/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPhoto = /* GraphQL */ `
  mutation CreatePhoto(
    $input: CreatePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    createPhoto(input: $input, condition: $condition) {
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
        photos {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePhoto = /* GraphQL */ `
  mutation UpdatePhoto(
    $input: UpdatePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    updatePhoto(input: $input, condition: $condition) {
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
        photos {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePhoto = /* GraphQL */ `
  mutation DeletePhoto(
    $input: DeletePhotoInput!
    $condition: ModelPhotoConditionInput
  ) {
    deletePhoto(input: $input, condition: $condition) {
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
        photos {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
      photos {
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
            photos {
              nextToken
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
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
      country
      cardholder_name
      bank_number
      stripe_account_id
      photos {
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
            photos {
              nextToken
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
      photos {
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
            photos {
              nextToken
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const activateMonetization = /* GraphQL */ `
  mutation ActivateMonetization(
    $id: String!
    $username: String!
    $name: String!
    $date_of_birth: String!
    $address: String!
    $post_code: String!
    $city: String!
    $phone: String!
    $cardholder_name: String!
    $country: String!
    $bank_number: String!
  ) {
    activateMonetization(
      id: $id
      username: $username
      name: $name
      date_of_birth: $date_of_birth
      address: $address
      post_code: $post_code
      city: $city
      phone: $phone
      cardholder_name: $cardholder_name
      country: $country
      bank_number: $bank_number
    )
  }
`;
export const activateStripeExpress = /* GraphQL */ `
  mutation ActivateStripeExpress(
    $id: String!
    $username: String!
    $country: String!
  ) {
    activateStripeExpress(id: $id, username: $username, country: $country)
  }
`;
