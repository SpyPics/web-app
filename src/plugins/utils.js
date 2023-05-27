import awsExports from '@/aws-exports.js';

export default {
  install: (app, options) => {
    const bucketURL = `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com`;
    const intDate = new Intl.DateTimeFormat(window.navigator.language || 'en-GB', {
      dateStyle: 'long',
      timeStyle: 'short'
    });

    const formatter = new Intl.NumberFormat(window.navigator.language || 'en-GB', {
      // style: 'currency',
      currency: 'EUR',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    const $formatPrice = (priceString) => {
      if (!priceString) {
        return '';
      }

      return formatter.format(priceString || 0);
    };
    app.config.globalProperties.$formatPrice = $formatPrice;

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
