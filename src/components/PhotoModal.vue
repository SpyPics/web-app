<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePhotosStore } from '@/stores/photos';
import defaultPhoto from '@/assets/logo.png';
import { useProfileStore } from '@/stores/profile.js';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const profileStore = useProfileStore();
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
  id: props.id,
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
  await router.push({name: 'dashboard'});
}

async function deletePhoto(event) {
  event.preventDefault();

  if (window.confirm('This is an irreversible action. Are you sure?')) {
    loading.value = true;

    if (formData.id) {
      await photosStore.deletePhoto(formData.id);
    }

    loading.value = false;
    router.push({name: 'dashboard'});
  }
}

onBeforeMount(() => {
  if (props.id) {
    photosStore.fetchPhotoById(props.id);
  }
});
</script>

<template>
  <form class="modal" @submit="save">
    <div class="modal-content">
      <header>
        <button type="button" @click="router.push({name: 'dashboard'})">
          <i class="material-symbols-rounded">arrow_back</i>
        </button>
        <h3>{{ formData.id ? 'Edit photo' : 'Add new photo' }}</h3>

        <div class="actions">
          <button v-if="formData.sold_at" class="btn" type="button" @click="router.push({name: 'dashboard'})">
            <i class="material-symbols-rounded">done</i>
            Done
          </button>

          <button v-else class="btn" type="submit" :disabled="loading || !isValid || !hasChanged">
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

        <template v-if="formData.sold_at">
          <div class="info-item">
            <span>Sold at</span>
            <strong>
              {{ $formatDate(formData.sold_at) }}
            </strong>
          </div>

          <div class="info-item">
            <span>Sold for</span>
            <strong class="text">
              <i class="material-symbols-rounded">euro_symbol</i>{{ formData.price }}
            </strong>
          </div>
        </template>

        <template v-else>
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
            <div class="text text-error" v-if="formData.ready_for_sell && !formData.price">
              The price must be set
            </div>
            <div class="text text-error" v-if="!profileStore.stripe_account_id">
              The monetization must be activated
            </div>
          </label>

          <label v-if="formData.updatedAt" class="info">
            Created at
            <strong>
              {{ $formatDate(formData.updatedAt) }}
            </strong>
          </label>
        </template>

        <div v-if="formData.id" class="actions-bar">
          <button class="btn btn-delete" type="button" @click="deletePhoto">
            <i class="material-symbols-rounded">delete</i>
            Delete
          </button>
        </div>

        <transition name="fade" :duration="150">
          <loader-icon-overlay v-show="loading"></loader-icon-overlay>
        </transition>
      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
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
