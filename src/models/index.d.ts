import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";



type EagerS3Object = {
  readonly bucket: string;
  readonly key: string;
  readonly region: string;
}

type LazyS3Object = {
  readonly bucket: string;
  readonly key: string;
  readonly region: string;
}

export declare type S3Object = LazyLoading extends LazyLoadingDisabled ? EagerS3Object : LazyS3Object

export declare const S3Object: (new (init: ModelInit<S3Object>) => S3Object)

type EagerPhoto = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Photo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly original: S3Object;
  readonly thumbnail?: S3Object | null;
  readonly description?: string | null;
  readonly ready_for_sell: boolean;
  readonly price?: number | null;
  readonly permalink?: string | null;
  readonly sold_at?: string | null;
  readonly latitude?: string | null;
  readonly longitude?: string | null;
  readonly altitude?: number | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly size?: number | null;
  readonly content_type?: string | null;
  readonly user_id: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPhoto = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Photo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly original: S3Object;
  readonly thumbnail?: S3Object | null;
  readonly description?: string | null;
  readonly ready_for_sell: boolean;
  readonly price?: number | null;
  readonly permalink?: string | null;
  readonly sold_at?: string | null;
  readonly latitude?: string | null;
  readonly longitude?: string | null;
  readonly altitude?: number | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly size?: number | null;
  readonly content_type?: string | null;
  readonly user_id: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Photo = LazyLoading extends LazyLoadingDisabled ? EagerPhoto : LazyPhoto

export declare const Photo: (new (init: ModelInit<Photo>) => Photo) & {
  copyOf(source: Photo, mutator: (draft: MutableModel<Photo>) => MutableModel<Photo> | void): Photo;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly name?: string | null;
  readonly bio?: string | null;
  readonly photos?: (Photo | null)[] | null;
  readonly bank_number?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly name?: string | null;
  readonly bio?: string | null;
  readonly photos: AsyncCollection<Photo>;
  readonly bank_number?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}