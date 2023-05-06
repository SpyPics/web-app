<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue';
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
const oldHash = ref('');
const newHash = ref('');
const formData = reactive({
  file: null,
  price: 0,
  ready_for_sell: false,
});
watch(formData, (input) => {
  if (typeof input.price === 'number') {
    newHash.value = JSON.stringify(formData);
  }
});

const {activePhoto} = storeToRefs(photosStore);
watch(activePhoto, (data) => {
  Object.assign(formData, data);
  formData.file = true;
  oldHash.value = JSON.stringify(formData);
});

const isValid = computed(() => {
  if (!formData.file) {
    return false;
  }

  return !(formData.ready_for_sell && !formData.price);
});

const hasChanged = computed(() => {
  return oldHash.value !== newHash.value;
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

  const jpg = file.target.files[0];
  if (jpg.type !== 'image/jpeg') {
    return alert('Only JPEG files are acceptable');
  }

  formData.file = jpg;

  if (formData.file) {
    preview.value = URL.createObjectURL(formData.file);
  }
}

function onPriceBlur() {
  if (typeof formData.price !== 'number') {
    formData.price = 0;
  }
}

async function save(event) {
  event.preventDefault();
  loading.value = true;

  if (formData.id) {
    if (hasChanged) {
      await photosStore.updatePhoto(formData);
    }
  } else {
    await photosStore.createPhoto(formData);
  }

  loading.value = false;
  await router.push({name: 'photos'});
}

async function deletePhoto(event) {
  event.preventDefault();

  if (window.confirm('This is an irreversible action. Are you sure?')) {
    loading.value = true;

    if (formData.id) {
      await photosStore.deletePhoto(formData.id);
    }

    loading.value = false;
    router.push({name: 'photos'});
  }
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
          <button class="btn" type="submit" :disabled="loading || !isValid || !hasChanged">
            <i class="material-symbols-rounded">done</i>
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
            <input type="number" step="any" v-model="formData.price" placeholder="0.00" @blur="onPriceBlur">
          </span>
        </label>

        <label class="field field-checkbox"
               :class="formData.ready_for_sell ? formData.price ? 'valid' : 'invalid' : ''">
          <div>
            <input type="checkbox" v-model="formData.ready_for_sell">
            <span>
              <i class="material-symbols-rounded">check</i>
            </span>

            <strong>Ready for sell</strong>
          </div>
          <div class="text">
            Checking this make this photo available in the store page
          </div>
          <div class="text error-text" v-if="formData.ready_for_sell && !formData.price">
            The price must be set in order for this photo to be sellable
          </div>
        </label>

        <label v-if="formData.updatedAt" class="info">
          Created at
          <strong>
            {{ $formatDate(formData.updatedAt) }}
          </strong>
        </label>

        <div v-if="formData.id" class="actions-bar">
          <button class="btn btn-delete" type="button" @click="deletePhoto">
            <i class="material-symbols-rounded">delete</i>
            Delete
          </button>
        </div>
      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 1em;
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
        flex: 0 0 50px;
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

  &.field-checkbox {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 6px 6px 10px;
    gap: 15px;

    &.valid {
      border-color: var(--color-akcent);
    }

    &.invalid {
      border-color: var(--color-invalid);
    }

    > div {
      font-weight: 300;
      display: flex;
      align-items: center;
      gap: 10px;

      > strong {
        font-weight: 500;
      }
    }

    input {
      opacity: 0;
      position: absolute;

      + span {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        border: 2px solid var(--color-text);
        color: var(--color-akcent-inside);

        > i {
          font-size: 20px;
          opacity: 0;
        }
      }

      &:checked + span {
        background-color: var(--color-akcent);

        > i {
          opacity: 1;
        }
      }
    }
  }
}

.info {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 10px;

  > strong {
    font-weight: 500;
  }
}

</style>
