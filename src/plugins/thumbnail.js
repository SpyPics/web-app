import awsExports from '@/aws-exports.js';

export default {
  install: (app, options) => {
    const bucketURL = `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com`;
    const $thumbnail = (photoId) => {
      return `${bucketURL}/public/thumbnails/${photoId}.jpg`;
    };
    app.config.globalProperties.$thumbnail = $thumbnail;

    app.provide('thumbnail', $thumbnail);
  }
};
