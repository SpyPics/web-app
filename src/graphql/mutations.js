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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
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
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      bank_number
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      bank_number
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      bank_number
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
