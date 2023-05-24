<script setup>
import defaultPhoto from '@/assets/logo.png';
import { ref, onBeforeMount } from 'vue';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getCheckoutLink as getCheckoutLinkQuery, getPhoto as getPhotoQuery } from '@/graphql/queries';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const props = defineProps({
  id: {
    type: String,
  }
});

const photo = ref({});
const loading = ref(false);

async function getCheckoutLink(photoId) {
  loading.value = true;
  const request = await API.graphql({
    query: getCheckoutLinkQuery,
    variables: {
      id: photoId
    },
    authMode: 'AWS_IAM'
  });

  return JSON.parse(request.data.getCheckoutLink);
}

async function navigateToCheckout() {
  const checkoutLink = await getCheckoutLink(props.id);
  switch (checkoutLink.type) {
    case 'checkout_link_open':
      console.info('In progress!');
      window.location.href = checkoutLink.url;
      break;

    case 'checkout_link':
      window.location.href = checkoutLink.url;
      break;

    case 'already_sold':
      console.info('Already sold!');
      break;

    default:
      console.error(checkoutLink);
      alert('Something went wrong! Please try again later.');
      break;
  }
}

onBeforeMount(async () => {
  if (props.id) {
    const response = await API.graphql({
      query: getPhotoQuery,
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

      <img class="preview" :src="$thumbnail(props.id)">

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
  gap: 2rem;
  padding: 1rem;
  position: relative;
  flex: 1 0 auto;

  .loader-icon-overlay {
    background-color: rgba(#181818, .75);
  }
}

.preview {
  max-width: 512px;
  max-height: 60vh;
  margin: 0 auto;
  box-shadow: 0 3px 15px rgba(#000, .15);
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

  > strong {
    font-weight: bold;
  }
}
</style>
