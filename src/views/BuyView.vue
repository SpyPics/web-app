<script setup>
import defaultPhoto from '@/assets/logo.png';
import { ref, onBeforeMount } from 'vue';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getCheckoutLink, getPhoto } from '@/graphql/queries';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const props = defineProps({
  id: {
    type: String,
  }
});

const photo = ref({});
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

  const json = JSON.parse(response.data.getCheckoutLink);
  if (json.success) {
    window.location.href = json.url;
  } else {
    console.error(json);
    alert('Something went wrong! Please try again later.');
  }
}

onBeforeMount(async () => {
  if (props.id) {
    const response = await API.graphql({
      query: getPhoto,
      variables: {
        id: props.id
      },
      authMode: 'AWS_IAM'
    });

    photo.value = response.data.getPhoto;

    console.log(response);
  }
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
