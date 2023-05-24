<script setup>
import { onMounted, onUnmounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import LoaderIconOverlay from '@/components/LoaderIconOverlay.vue';

const router = useRouter();
const $thumbnail = inject('thumbnail');
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

onMounted(() => {
  if (props.photo.id) {
    loadThumbnail($thumbnail(props.photo.id));
  }
});

onUnmounted(() => {
  clearTimeout(attemptTimeout);
});

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

function navigateToEditModal() {
  router.push({name: 'edit-photo', params: {id: props.photo.id}});
}
</script>

<template>
  <div class="photo-card" @click="navigateToEditModal">
    <div class="thumbnail">
      <Transition name="fade">
        <img v-if="thumbnail" :src="thumbnail"/>
      </Transition>
      <loader-icon-overlay v-show="!thumbnail"></loader-icon-overlay>
    </div>

    <div class="price">
      <i class="material-symbols-rounded">euro_symbol</i>
      {{ photo.price || '0,00' }}
    </div>

    <p v-if="photo.sold_at" class="text text-success">
      <i class="material-symbols-rounded">thumb_up</i>
      Sold at {{ $formatDate(photo.sold_at) }}
    </p>

    <p v-else-if="photo.ready_for_sell" class="text text-success">
      <i class="material-symbols-rounded">sell</i>
      Ready for sell
    </p>

    <p v-else class="text">
      <i class="material-symbols-rounded">priority_high</i>
      Not ready for sell
    </p>

    <p v-else class="text">
      <i class="material-symbols-rounded">priority_high</i>
      Not ready
    </p>

    <p class="text small">
      {{ $formatDate(photo.createdAt) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.photo-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: .5em .5em;
  gap: .1em;
  background-color: #000;
  border-radius: 12px;
  border: 1px solid transparent;
  position: relative;

  &:hover {
    border-color: var(--color-akcent);
  }

  > *:first-child {
    margin-bottom: .9em;
  }

  > *:last-child {
    margin-top: .9em;
  }
}

.thumbnail {
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  > img {
    max-width: 100%;
    max-height: 100%;
    background-color: #000;
    border-radius: 6px;
    display: block;
  }
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;

  > i {
    font-size: inherit;
  }
}

.small {
  place-self: flex-end;
}
</style>
