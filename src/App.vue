<script setup>
import { watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';

const auth = useAuthenticator();

const services = {

}

</script>

<template>
  <authenticator variation="modal">
    <!--    <template v-slot="{ user, signOut }">-->
    <!--      <h1>Hello {{ user.username }}!</h1>-->
    <!--      <button @click="signOut">Sign Out</button>-->
    <!--    </template>-->
  </authenticator>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg"/>

    <div class="wrapper" v-if="auth.route === 'authenticated'">
<!--      <h3>{{ auth.user?.attributes.email }}</h3>-->
      <h3>{{ auth.user.username }}</h3>
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
  overflow: auto;
  padding: 15px 5px;
  position: relative;
}

.logo {
  height: 100%;
  padding: 5px;
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
  padding: 0 5px;
  align-items: center;
  font-weight: 400;
  text-transform: uppercase;
  flex: 1 0 auto;
  justify-content: center;
  row-gap: 5px;
  height: 100%;
  font-size: .88rem;

  &.router-link-exact-active {
    color: #fff;
    background-color: hsla(160, 100%, 37%, 0.2);
  }

  &.route-item--profile {
    flex: 0 0 64px;
  }
}
</style>
