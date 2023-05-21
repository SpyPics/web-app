<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
// import { Auth } from 'aws-amplify';
import { storeToRefs } from 'pinia';
import QRCode from 'qrcode';
import { usePhotosStore } from '@/stores/photos';
import defaultPhoto from '@/assets/logo.png';

const photosStore = usePhotosStore();
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
  }
});
const canvas = ref(null);
const preview = ref();
const loading = ref(false);
const oldHash = ref('');
const newHash = ref('');
const formData = reactive({
  file: null,
  price: 0,
  ready_for_sell: false,
});

const {activePhoto} = storeToRefs(photosStore);
watch(activePhoto, (data) => {

  QRCode.toDataURL(`/buy/${data.id}`)
    .then(url => {
      console.log(url);
      preview.value = url;
    })
    .catch(err => {
      console.error(err);
    });
});


// With promises


async function done(event) {

}

onBeforeMount(() => {
  if (props.id) {
    const permalink = `${import.meta.env.VITE_APP_URL}/buy/${props.id}`;
    console.log(permalink);
    QRCode.toDataURL(permalink, {errorCorrectionLevel: 'H'})
      .then(url => {
        // console.log(url);
        preview.value = url;
      })
      .catch(err => {
        console.error(err);
      });
    // photosStore.fetchPhotoById(props.id);
  }
});
</script>

<template>
  <form class="modal" @submit="done">
    <div class="modal-content">
      <header>
        <button type="button" @click="router.push({name: 'store'})">
          <i class="material-symbols-rounded">arrow_back</i>
        </button>
        <h3>{{ 'Ready For Sell' }}</h3>

        <div class="actions">
          <button class="btn" type="submit">
            <i class="material-symbols-rounded">done</i>
            dine
          </button>
        </div>
      </header>

      <main>
        <img class="qr-code" :src="preview">

        <label class="field field-photo">
          <img class="preview" :src="$thumbnail(props.id)">
        </label>
      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
  overflow: hidden;
}

.qr-code {
  aspect-ratio: 1/1;
  max-width: 512px;
  max-height: 512px;
  width: 100%;
  margin: 0 auto;
  border-radius: 12px;
  flex: 0 0 auto;
}

.field.field-photo {
  width: auto;
  flex: 0 1 auto;
  max-height: 256px;
}
</style>
