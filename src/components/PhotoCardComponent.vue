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
      console.log(raw);
      return {};
    }
  }
});
const thumbnail = ref(null);
const loading = ref(true);
onMounted(() => {
  if (props.photo.id) {
    loadThumbnail($thumbnail(props.photo.id));
  }
});

function loadThumbnail(url) {
  const image = new Image();
  image.src = url;
  image.decode()
    .then(() => {
      thumbnail.value = url;
    })
    .catch(() => {
      setTimeout(() => {
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
      <span>{{ photo.price || '0,00' }}</span>
    </div>

    <p>
      {{ photo.ready_for_sell }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.photo-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 6px;
  gap: 10px;
  background-color: #000;
  border-radius: 12px;
  border: 1px solid transparent;
  position: relative;

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
  gap: 5px;

  > i {
    font-size: inherit;
  }
}
</style>
