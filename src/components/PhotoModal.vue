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
const preview = ref();
const loading = ref(false);
const formData = reactive({
  file: null,
  price: 0.00,
  ready_for_sell: false,
});
const {activePhoto} = storeToRefs(photosStore);

watch(activePhoto, (data) => {
  Object.assign(formData, data);
});


onBeforeMount(() => {
  if (props.id) {
    photosStore.fetchPhotoById(props.id);
  }
});


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
  loading.value = true;
  if (formData.id) {
    await photosStore.updatePhoto(formData);
  } else {
    await photosStore.createPhoto(formData);
  }

  loading.value = false;
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
          <button class="btn" type="submit" :disabled="loading">
            Save
          </button>
        </div>
      </header>

      <main>
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
          <span class="input">
            <i class="material-symbols-rounded">euro_symbol</i>
            <input type="number" step="any" v-model="formData.price" placeholder="0.00">
          </span>
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
    background-color: #000;
    padding: 15px;
    gap: 15px;
    margin: 0 auto;
    width: 100%;
    max-width: 512px;

    > input {
      opacity: 0;
      position: absolute;
      visibility: hidden;
      width: 100px;
    }

    > .preview {
      object-fit: contain;
      aspect-ratio: 1/1;
      width: 100%;
      border-radius: 6px;
    }
  }

  &.field-price {
    > .input {
      display: flex;
      flex-direction: row;
      align-items: center;
      overflow: hidden;

      > i {
        width: 50px;
        font-size: 3rem;
        flex: 1 0 50px;
      }

      > input {
        background-color: transparent;
        border-style: dashed;
        border-color: var(--color-border);
        border-width: 0 0 1px;
        padding-left: 50px;
        margin-left: -50px;
        font-size: 3rem;
        flex: 1 1 auto;

        &::placeholder {
          color: var(--vt-c-black-mute);
        }

        &:focus {
          outline: none;
          border-color: var(--color-akcent);
        }
      }
    }
  }
}


</style>
