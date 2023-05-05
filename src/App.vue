<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';

const auth = useAuthenticator();
const route = useRoute();

function setHeight() {
  document.body.style.height = `${window.innerHeight}px`;
}

window.addEventListener('resize', setHeight);
setHeight();
</script>

<template>
  <Authenticator variation="modal"></Authenticator>
  <header>
    <RouterLink to="/photos">
      <img alt="Vue logo" class="logo" src="@/assets/logo.png"/>
    </RouterLink>
    <div class="wrapper" v-if="auth.route === 'authenticated'">
      <h3>{{ route.meta?.title }}</h3>
      <!--      <h3>{{ auth.user.attributes.email }}</h3>-->
      <!--      <h3>{{ auth.user.username }}</h3>-->
      <RouterLink class="route-item route-item--profile" to="/profile">
        <i class="material-symbols-rounded">
          account_box
        </i>
        Profile
      </RouterLink>
    </div>
  </header>

  <main>
    <RouterView/>
  </main>

  <nav>
    <RouterLink class="route-item small" to="/add-photo">
      <i class="material-symbols-rounded">
        add
      </i>
    </RouterLink>
    <RouterLink class="route-item" to="/photos">
      <i class="material-symbols-rounded">
        photo_library
      </i>
      Photos
    </RouterLink>
    <RouterLink class="route-item" to="/store">
      <i class="material-symbols-rounded">
        store
      </i>
      Store
    </RouterLink>
  </nav>

  <router-view class="modal" name="modal" v-slot="{ Component }">
    <transition name="modal">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  line-height: 1.5;
  grid-area: header-area;
  overflow: hidden;
  column-gap: 10px;
  padding: 0;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1 1 auto;
  }
}

main {
  grid-area: content-area;
  overflow: hidden;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 100%;
  padding: 10px;
}

nav {
  display: flex;
  flex-direction: row;
  grid-area: footer-area;
  overflow: hidden;
  padding: 0;
}

.route-item {
  display: inline-flex;
  flex-direction: column;
  padding: 0 10px;
  align-items: center;
  font-weight: 400;
  text-transform: uppercase;
  flex: 1 0 auto;
  justify-content: center;
  row-gap: 5px;
  height: 100%;
  font-size: .8rem;

  &.router-link-exact-active {
    color: #fff;
    background-color: hsla(160, 100%, 37%, 0.2);
  }

  &.route-item--profile {
    flex: 0 0 74px;
  }

  &.small {
    flex: 0 0 64px;
  }
}
</style>
