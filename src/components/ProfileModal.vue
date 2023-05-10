<script setup>
import { useRouter } from 'vue-router';
import { Auth } from 'aws-amplify';
import { usePhotosStore } from '@/stores/photos';

const user = Auth.user;


const router = useRouter();

function save(event) {
  event.preventDefault();
  // console.log(formData);
  // store.createPhoto(formData);
  // router.push({name: 'profile'});

  return false;
}
</script>

<template>
  <form class="modal" @submit="save">
    <div class="modal-content">
      <header>
        <button type="button" @click="router.push({name: 'dashboard'})">
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
        <section>
          <h3>
            Account
          </h3>

          <label class="field">
            <span>Username/Email</span>
            <strong>
              {{ user.attributes.email }}
            </strong>
          </label>
        </section>


        <section>
          <h3>
            User Details
          </h3>
          <label class="field field-text">
          <span>
            Name
          </span>
            <input type="text"/>
          </label>

          <label class="field field-text">
          <span>
            Bio
          </span>
            <textarea></textarea>
          </label>
        </section>

        <section>
          <h3>
            Bank Details
          </h3>
          <label class="field field-text">
          <span>
            Bank No
          </span>
            <input type="text"/>
          </label>
        </section>

        <div class="actions-bar">
          <button class="btn" @click="Auth.signOut">Sign out</button>
        </div>
      </main>
    </div>
  </form>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  padding: 1rem .5rem;
  gap: 2.5rem;

  > section {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > h3 {
      color: var(--vt-c-text-dark-2);
      font-weight: 600;
    }
  }
}
</style>
