<script setup>
import { useRouter } from 'vue-router';
import { Auth } from 'aws-amplify';
import { usePhotosStore } from '@/stores/photos';

const store = usePhotosStore();

const router = useRouter();

function save(event) {
  event.preventDefault();
  // console.log(formData);
  // store.createPhoto(formData);
  router.push({name: 'profile'});

  return false;
}
</script>

<template>
  <form class="modal" @submit="save">
    <div class="modal-content">
      <header>
        <button type="button" @click="router.push('/photos')">
          <i class="material-symbols-rounded">
            arrow_back
          </i>
        </button>
        <h3>Profile</h3>

        <div class="actions">
          <button class="btn" type="submit">
            Save
          </button>
        </div>
      </header>

      <main>


      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">

</style>
