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
      <span>{{ $formatPrice(photo.price / 100) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: .6rem;
  gap: .8rem;
  background-color: #000;
  border: 1px solid transparent;
  position: relative;
  max-width: 512px;
  max-height: 612px;
  margin: 0 auto;
  box-shadow: 0 7px 15px rgba(#888, .15);

  &:hover {
    border-color: var(--color-akcent);
  }
}

.thumbnail {
  width: 100%;
  position: relative;
  overflow: hidden;

  > img {
    max-width: 100%;
    max-height: 100%;
    margin: 0 auto;
    background-color: #000;
    display: block;
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
