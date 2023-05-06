import awsExports from '@/aws-exports.js';

export default {
  install: (app, options) => {
    const bucketURL = `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com`;
    const intDate = new Intl.DateTimeFormat(window.navigator.language || 'en-GB', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
    const $thumbnail = (photoId) => {
      return `${bucketURL}/public/thumbnails/${photoId}.jpg`;
    };
    app.config.globalProperties.$thumbnail = $thumbnail;

    const $formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return intDate.format(date);
      } catch (error) {
        // console.error(error);
        return dateString;
      }
    };
    app.config.globalProperties.$formatDate = $formatDate;

    app.provide('thumbnail', $thumbnail);
    app.provide('formatDate', $formatDate);
  }
};
