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
      _version
      _deleted
      _lastChangedAt
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
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPhotos = /* GraphQL */ `
  query SyncPhotos(
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPhotos(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
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
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
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
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
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
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
      nextToken
      startedAt
    }
  }
`;
