<script setup>
import defaultPhoto from '@/assets/logo.png';
import { ref, onBeforeMount } from 'vue';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getCheckoutLink, getPhoto } from '@/graphql/queries';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const props = defineProps({
  sessionId: {
    type: String,
  }
});

const photo = ref({});
const loading = ref(false);

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  a.addEventListener('click', clickHandler, false);
  a.click();
  return a;
}


async function navigateToCheckout() {
  const response = await Storage.get('3f4e0493-4b1d-4d43-b503-6a0fb307f977/b35fbcde-da91-4567-bb33-18fbbf63c4e7.jpg', {
    level: 'protected', // defaults to `public`
    download: true, // defaults to false
  });

  downloadBlob(response.Body, 'b35fbcde-da91-4567-bb33-18fbbf63c4e7.jpg');
}

onBeforeMount(async () => {

});

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
      <p class="price">
        <i class="material-symbols-rounded">euro_symbol</i>
        {{ photo.price }}
      </p>

      <p class="seller">
        <strong>Seller</strong>
        {{ photo.user?.username }}
      </p>

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

.price {
  font-size: 3rem;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > i {
    font-size: inherit;
  }
}

.seller {
  font-size: 1.5rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  margin-top: 1rem;

  > strong {
    font-weight: bold;
  }
}
</style>
