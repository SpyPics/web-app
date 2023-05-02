<script setup>
import { useRouter } from 'vue-router';
import { Auth } from 'aws-amplify';
import { usePhotosStore } from '@/stores/photos';

const store = usePhotosStore();

const router = useRouter();

defineProps({
  msg: {
    type: String,
  }
});

const formData = {
  file: null
};

// async function onFileChange(file) {
//   if (!file.target || !file.target.files[0]) {
//     return;
//   }
//   try {
//     await store.createPhoto({
//       file: file.target.files[0],
//       id: this.id,
//     });
//     this.getPhotos();
//   } catch (error) {
//     console.log('error create photo', error);
//   }
// }

function setFile(file) {
  if (!file.target || !file.target.files[0]) {
    return;
  }
  formData.file = file.target.files[0];

}

function save(event) {
  event.preventDefault();
  console.log(formData);
  store.createPhoto(formData)

  return false;
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <header>
        <h3>Add new photo</h3>

        <button type="button" @click="router.push('/photos')">
          <i class="material-symbols-rounded">
            close
          </i>
        </button>
      </header>

      <main>
        <form @submit="save">
          <label>
            <span>Select a photo</span>
            <input type="file" accept="image/jpeg" @change="setFile">
          </label>

          <button type="submit">
            Save
          </button>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
