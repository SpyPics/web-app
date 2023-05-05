<script setup>
import { Storage } from 'aws-amplify';
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { usePhotosStore } from '@/stores/photos';
import awsExports from '@/aws-exports';
import PhotoCardComponent from '@/components/PhotoCardComponent.vue';

const bucketURL = `https://${awsExports.aws_user_files_s3_bucket}.s3.${awsExports.aws_user_files_s3_bucket_region}.amazonaws.com`;

const store = usePhotosStore();


onMounted(() => {
  store.fetchPhotos();
  console.log(store.photos);
});
</script>

<template>
  <nav class="view-nav">
    <h2>
      Photos
    </h2>


  </nav>

  <main class="view-content">
    <PhotoCardComponent v-for="item of store.photos" :photo="item">
    </PhotoCardComponent>
  </main>

  <RouterView/>
</template>

<style scoped lang="scss">
main {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: max-content;
  padding: 10px;
}
</style>
