<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { usePhotosStore } from '@/stores/photos.js';

const photosStore = usePhotosStore();

onMounted(() => {
});
</script>

<template>
  <article>
    <nav class="view-nav">
      <h2>
        Store
      </h2>
    </nav>

    <main class="view-content">
      <product-card v-for="item of photosStore.products" :photo="item" :key="item.id">
      </product-card>
    </main>

    <RouterView/>
  </article>
</template>

<style scoped lang="scss">
main {
  display: grid;
  gap: .5em;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  padding: 1em .5em;
}
</style>
