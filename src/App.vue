<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreatePhoto, onDeletePhoto, onUpdatePhoto } from '@/graphql/subscriptions.js';
import { usePhotosStore } from '@/stores/photos.js';
import '@aws-amplify/ui-vue/styles.css';
// import { useProductsStore } from '@/stores/products.js';

const auth = useAuthenticator();
const route = useRoute();
const height = ref();

onMounted(() => {
  const appElement = document.querySelector('#app');

  function setHeight() {
    appElement.style.height = `${window.innerHeight}px`;
    height.value = window.innerHeight;
  }

  window.addEventListener('resize', setHeight);
  setHeight();
});
</script>

<template>

    <RouterView/>

</template>

<style lang="scss" scoped>

</style>
