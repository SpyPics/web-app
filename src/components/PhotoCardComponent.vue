<script setup>
import { computed } from 'vue';
import awsExports from '@/aws-exports.js';

const bucketURL = `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com`;

const props = defineProps({
  photo: {
    type: Object,
    default(raw) {
      console.log(raw);
      return {};
    }
  }
});

const thumbnailURL = computed(() => {
  return `${bucketURL}/public/thumbnails/${props.photo.id}.jpg`;
});

</script>

<template>
  <div class="photo-card">
    <img :src="thumbnailURL"/>
    <p class="price">
      {{ props.photo.price || '$ 0,00'}}
    </p>

    <p>
      {{ props.photo.ready_for_sell }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.photo-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 15px;
  gap: 10px;
  background-color: #222222;

  > img {
    flex: 1 0 auto;
    aspect-ratio: 1/1;
    width: 100%;
    background-color: #000;
  }
}

.price {
  font-size: 2em;
  font-weight: bold;
}
</style>
