<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import ProductCard from '@/components/ProductCard.vue';

const productsStore = useProductsStore();

onMounted(() => {
  productsStore.fetchProducts();
});
</script>

<template>
  <nav class="view-nav">
    <h2>
      Store
    </h2>
  </nav>

  <main class="view-content">
    <product-card v-for="item of productsStore.products" :photo="item">
    </product-card>
  </main>

  <RouterView/>
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
