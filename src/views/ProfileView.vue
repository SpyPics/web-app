<script setup>
import { useAuthenticator } from '@aws-amplify/ui-vue';

const auth = useAuthenticator();
</script>

<template>
  <h1>
    Profile
  </h1>
  <main>
    <button @click="auth.signOut">Sign out</button>
  </main>
</template>
