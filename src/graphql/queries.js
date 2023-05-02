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
      thumbnail {
        bucket
        key
        region
      }
      description
      ready_for_sell
      price
      permalink
      sold_at
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
      owner
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
        thumbnail {
          bucket
          key
          region
        }
        description
        ready_for_sell
        price
        permalink
        sold_at
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
        owner
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
        thumbnail {
          bucket
          key
          region
        }
        description
        ready_for_sell
        price
        permalink
        sold_at
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
        owner
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
      photos {
        items {
          id
          original {
            bucket
            key
            region
          }
          thumbnail {
            bucket
            key
            region
          }
          description
          ready_for_sell
          price
          permalink
          sold_at
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
          owner
        }
        nextToken
      }
      bank_number
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
        photos {
          items {
            id
            original {
              bucket
              key
              region
            }
            thumbnail {
              bucket
              key
              region
            }
            description
            ready_for_sell
            price
            permalink
            sold_at
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
            owner
          }
          nextToken
        }
        bank_number
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
