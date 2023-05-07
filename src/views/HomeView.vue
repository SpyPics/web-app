<script setup>
import { useAuthenticator } from '@aws-amplify/ui-vue';

const auth = useAuthenticator();
</script>
<template>
  <article>
    <header>
      <h1>Welcome to SpyPics</h1>
    </header>

    <main>
      <p>Are you looking for stunning photos to use for your next project or to hang on your walls? Look no further than
        SpyPics, where hobby photographers from around the world share their best work.</p>
      <p>Our user-friendly platform makes it easy to browse and purchase photos in a variety of categories, including
        nature, architecture, people, and more.</p>
      <p>Whether you're a designer, blogger, or just someone who loves beautiful photography, SpyPics has something for
        everyone. Sign up today to start exploring!</p>

      <div class="actions-bar">
        <RouterLink class="btn" :to="{name: 'auth'}">
          Login
        </RouterLink>
      </div>
    </main>
  </article>
</template>
<style lang="scss" scoped>
header {
  padding: 1em;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}
</style>
