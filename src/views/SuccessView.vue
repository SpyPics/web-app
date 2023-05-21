<script setup>
import defaultPhoto from '@/assets/logo.png';
import { ref, onBeforeMount } from 'vue';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { getPaymentStatus as getPaymentStatusQuery, getPhoto as getPhotoQuery, downloadImage } from '@/graphql/queries';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const props = defineProps({
  id: {
    type: String,
  }
});

const photo = ref({});
const loading = ref(true);
const canDownload = ref(false);

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


async function downloadPhoto() {
  loading.value = true;
  const photoData = photo.value;
  const response = await Storage.get(`${photoData.user_id}/${photoData.id}.jpg`, {
    level: 'public',
    download: true,
  });

  downloadBlob(response.Body, `${photoData.id}.jpg`);

  // const response = await API.graphql({
  //   query: downloadImage,
  //   variables: {
  //     id: photoData.id
  //   },
  //   authMode: 'AWS_IAM'
  // });
  console.log(response)

  loading.value = false;
}

async function getPaymentStatus(sessionId) {
  loading.value = true;
  const response = await API.graphql({
    query: getPaymentStatusQuery,
    variables: {
      id: sessionId
    },
    authMode: 'AWS_IAM'
  });

  loading.value = false;
  return JSON.parse(response.data.getPaymentStatus);
}


onBeforeMount(async () => {
  if (!props.id) {
    window.location.href = '/';
  }

  if (props.id) {
    const response = await API.graphql({
      query: getPhotoQuery,
      variables: {
        id: props.id
      },
      authMode: 'AWS_IAM'
    });

    photo.value = response.data.getPhoto;

    if (!photo.value.session_id) {
      // debugger
      // window.location.href = '/';
      console.error('No session_id found');
    }

    const status = await getPaymentStatus(photo.value.id);
    canDownload.value = status.success;
  }
});

</script>
<template>
  <article>
    <header>
      <h1>Successful</h1>
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

      <!--      <a href="">-->
      <!--        This photo is available for purchase-->
      <!--      </a>-->

      <div class="actions-bar">
        <button class="btn" v-if="canDownload" @click="downloadPhoto">Download Photo</button>
        <p v-else>Checking...</p>
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
