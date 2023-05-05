<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
// import { Auth } from 'aws-amplify';
import { storeToRefs } from 'pinia';
import { usePhotosStore } from '@/stores/photos';
import defaultPhoto from '@/assets/logo.png';

const photosStore = usePhotosStore();

const router = useRouter();

const props = defineProps({
  id: {
    type: String,
  }
});

const formData = reactive({
  file: null,
  price: 0.00,
  ready_for_sell: false,
});
const {activePhoto} = storeToRefs(photosStore);

watch(activePhoto, (data) => {
  Object.assign(formData, data);
  // console.log(formData);
});


onBeforeMount(() => {
  if (props.id) {
    photosStore.fetchPhotoById(props.id);
  }
});

const preview = ref();

function setFile(file) {
  if (!file.target || !file.target.files[0]) {
    return;
  }
  formData.file = file.target.files[0];

  if (formData.file) {
    preview.value = URL.createObjectURL(formData.file);
  }
}

async function save(event) {
  event.preventDefault();
  if (formData.id) {
    await photosStore.updatePhoto(formData);
  } else {
    await photosStore.createPhoto(formData);
  }

  await router.push({name: 'photos'});
}
</script>

<template>
  <form class="modal" @submit="save">
    <div class="modal-content">
      <header>
        <button type="button" @click="router.push('/photos')">
          <i class="material-symbols-rounded">arrow_back</i>
        </button>
        <h3>{{ formData.id ? 'Edit photo' : 'Add new photo' }}</h3>

        <div class="actions">
          <button class="btn" type="submit">
            Save
          </button>
        </div>
      </header>

      <main class="">
        <label class="field field-photo">
          <img v-if="formData.id" class="preview" :src="$thumbnail(formData.id)">
          <template v-else>
            <span class="btn">Select a photo</span>
            <input type="file" accept="image/jpeg" @change="setFile">
            <img class="preview" :src="preview || defaultPhoto">
          </template>
        </label>

        <label class="field field-price">
          <span>Price</span>
          <div>
            <i class="material-symbols-rounded">euro_symbol</i>
            <input type="number" step="any" v-model="formData.price">
          </div>
        </label>

        <label class="field">
          <span>Ready for sell</span>
          <input type="checkbox" v-model="formData.ready_for_sell">
          <span></span>
        </label>


        <p>{{ formData.updatedAt }}</p>

      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  position: relative;

  &.field-photo {
    align-items: stretch;
    border-radius: 12px;
    background-color: #333;
    padding: 15px;
    margin: 0 auto;

    > input {
      opacity: 0;
      position: absolute;
    }

    > .preview {
      object-fit: contain;
      aspect-ratio: 1/1;
      width: 512px;
      max-width: 512px;
      max-height: 512px;
      border-radius: 6px;
      margin-top: 15px;
    }
  }

  &.field-price {
    > div {
      display: flex;
      flex-direction: row;
      align-items: center;

      > i {
        width: 50px;
        font-size: 3rem;
      }

      > input {
        background-color: transparent;
        border-style: dashed;
        border-color: var(--color-border);
        border-width: 0 0 1px;
        padding-left: 50px;
        margin-left: -50px;
        font-size: 3rem;
        flex: 1 0 auto;

        &:focus {
          outline: none;
          border-color: var(--color-akcent);
        }
      }
    }
  }
}


</style>
