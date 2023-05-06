<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { usePhotosStore } from '@/stores/photos';
import PhotoCard from '@/components/PhotoCard.vue';

const photosStore = usePhotosStore();

onMounted(() => {
  photosStore.fetchPhotos();
});
</script>

<template>
  <nav class="view-nav">
    <h2>
      Photos
    </h2>
  </nav>

  <main class="view-content">
    <photo-card v-for="item of photosStore.photos" :photo="item" :key="item.id">
    </photo-card>
  </main>

  <RouterView/>
</template>

<style scoped lang="scss">
main {
  display: grid;
  gap: .5em;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: max-content;
  padding: 1em .5em;
}
</style>
