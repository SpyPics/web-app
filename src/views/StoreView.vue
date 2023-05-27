<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { usePhotosStore } from '@/stores/photos.js';
import { useProfileStore } from '@/stores/profile.js';

const profileStore = useProfileStore();
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
      <p v-if="!profileStore.stripe_account_id" class="not-active">
        Please activate monetization in your profile
        <router-link :to="{name: 'profile', query: {return: 'store'}}">Go to profile</router-link>
      </p>

      <template v-else>
        <product-card v-for="item of photosStore.products" :photo="item" :key="item.id">
        </product-card>
      </template>
    </main>

    <RouterView/>
  </article>
</template>

<style scoped lang="scss">
main {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  padding: 1rem .5rem;
}

.not-active {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: center;
}
</style>
