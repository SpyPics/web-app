/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto(
    $filter: ModelSubscriptionPhotoFilterInput
    $owner: String
  ) {
    onCreatePhoto(filter: $filter, owner: $owner) {
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
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto(
    $filter: ModelSubscriptionPhotoFilterInput
    $owner: String
  ) {
    onUpdatePhoto(filter: $filter, owner: $owner) {
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
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto(
    $filter: ModelSubscriptionPhotoFilterInput
    $owner: String
  ) {
    onDeletePhoto(filter: $filter, owner: $owner) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
