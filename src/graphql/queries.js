/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPhoto = /* GraphQL */ `
  query GetPhoto($id: ID!) {
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
export const listPhotos = /* GraphQL */ `
  query ListPhotos(
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
          photos {
            items {
              id
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
      nextToken
    }
  }
`;
export const photosByUser_id = /* GraphQL */ `
  query PhotosByUser_id(
    $user_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    photosByUser_id(
      user_id: $user_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
            items {
              id
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
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getCheckoutLink = /* GraphQL */ `
  query GetCheckoutLink($id: String!) {
    getCheckoutLink(id: $id)
  }
`;
export const getPaymentStatus = /* GraphQL */ `
  query GetPaymentStatus($id: String!) {
    getPaymentStatus(id: $id)
  }
`;
export const downloadImage = /* GraphQL */ `
  query DownloadImage($id: String!) {
    downloadImage(id: $id)
  }
`;
