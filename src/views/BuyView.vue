<script setup>
import defaultPhoto from '@/assets/logo.png';
import { ref } from 'vue';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getCheckoutLink } from '@/graphql/queries';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const props = defineProps({
  id: {
    type: String,
  }
});

const loading = ref(false);

async function navigateToCheckout() {
  loading.value = true;
  const response = await API.graphql({
    query: getCheckoutLink,
    variables: {
      id: props.id
    },
    authMode: 'AWS_IAM'
  });
  window.location.href = response.data.getCheckoutLink;
  console.log(response);
}
</script>
<template>
  <article>
    <header>
      <h1>Buy Photo</h1>
    </header>

    <main>
      <label class="field field-photo">
        <img class="preview" :src="$thumbnail(props.id)">
      </label>

      <div class="actions-bar">
        <button class="btn" @click="navigateToCheckout">Buy Photo</button>
      </div>

      <loader-icon-overlay v-show="loading"></loader-icon-overlay>
    </main>
  </article>
</template>
<style lang="scss" scoped>
article {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  padding: 1em;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  position: relative;
  flex: 1 0 auto;

  .loader-icon-overlay {
    background-color: rgba(#181818, .75);
  }
}
</style>
