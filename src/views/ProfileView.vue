<script setup>
import { Auth } from 'aws-amplify';

const user = Auth.user;
</script>

<template>
  <article>
    <h1>
      Profile
    </h1>
    <main class="view-content">
      <h2>
        {{ user.attributes.email }}
      </h2>

      <div class="actions-bar">
        <button class="btn" @click="Auth.signOut">Sign out</button>
      </div>
    </main>
  </article>
</template>
<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
}
</style>
