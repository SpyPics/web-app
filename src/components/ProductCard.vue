<script setup>
import { onMounted, onBeforeMount, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const $thumbnail = inject('thumbnail');
const router = useRouter();
const props = defineProps({
  photo: {
    type: Object,
    default(raw) {
      return {};
    }
  }
});
const thumbnail = ref(null);
const loading = ref(true);
let attemptTimeout;
let attempts = 0;

function loadThumbnail(url) {
  const image = new Image();
  image.src = url;
  image.decode()
    .then(() => {
      thumbnail.value = url;
    })
    .catch(() => {
      if (attempts > 10) {
        return console.error(`Could load the thumbnail after ${attempts}`, url);
      }
      attempts++;
      attemptTimeout = setTimeout(() => {
        loadThumbnail(url);
      }, 5000);
    });
}

function navigateToSell() {
  router.push({name: 'sell-photo', params: {id: props.photo.id}});
}

onMounted(() => {
  if (props.photo.id) {
    loadThumbnail($thumbnail(props.photo.id));
  }
});
</script>

<template>
  <div class="product-card" @click="navigateToSell">
    <div class="thumbnail">
      <Transition name="fade">
        <img v-if="thumbnail" :src="thumbnail"/>
      </Transition>
      <loader-icon-overlay v-show="!thumbnail"></loader-icon-overlay>
    </div>

    <div class="price">
      <i class="material-symbols-rounded">euro_symbol</i>
      <span>{{ photo.price }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: .5em;
  gap: .5em;
  background-color: #000;
  border-radius: 12px;
  border: 1px solid transparent;
  position: relative;
  width: 100%;
  max-width: 512px;
  margin: 0 auto;

  &:hover {
    border-color: var(--color-akcent);
  }
}

.thumbnail {
  width: 100%;
  padding-top: 100%;

  > img {
    position: absolute;
    flex: 1 0 auto;
    aspect-ratio: 1/1;
    width: 100%;
    background-color: #000;
    border-radius: 6px;
    top: 0;
    left: 0;
  }
}

.price {
  font-size: 2rem;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 5px;
  color: var(--vt-c-white);

  > i {
    font-size: inherit;
  }
}
</style>
