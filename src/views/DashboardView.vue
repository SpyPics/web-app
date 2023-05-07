<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { API, Auth, graphqlOperation, Hub } from 'aws-amplify';
import { onCreatePhoto, onDeletePhoto, onUpdatePhoto } from '@/graphql/subscriptions.js';
import { usePhotosStore } from '@/stores/photos.js';
import '@aws-amplify/ui-vue/styles.css';

const user = ref({});
const router = useRouter();
const route = useRoute();
const height = ref();
const photosStore = usePhotosStore();
const hubListenerCancelToken = Hub.listen('auth', (data) => {
  const {payload} = data;
  if (!payload.data) {
    return;
  }

  if (payload.event === 'signIn') {
    nextTick(() => {
      subscribe();
      router.push({name: 'dashboard'});
    });
  }

  if (payload.event === 'signOut') {
    nextTick(() => {
      unsubscribe();
      router.push({name: 'home'});
    });
  }
});


const subscriptions = [];

function subscribe() {
  subscriptions.push(API.graphql(graphqlOperation(onCreatePhoto)).subscribe({
    next: ({provider, value}) => {
      const photo = value.data.onCreatePhoto;
      photosStore.$createPatch(photo);
    },
    error: error => console.warn(error)
  }));

  subscriptions.push(API.graphql(graphqlOperation(onUpdatePhoto)).subscribe({
    next: ({provider, value}) => {
      const photo = value.data.onUpdatePhoto;
      photosStore.$updatePatch(photo);
    },
    error: error => console.warn(error)
  }));

  subscriptions.push(API.graphql(graphqlOperation(onDeletePhoto)).subscribe({
    next: ({provider, value}) => {
      photosStore.$deletePatch(value.data.onDeletePhoto);
    },
    error: error => console.warn(error)
  }));

  photosStore.fetchPhotos();
}

function unsubscribe() {
  subscriptions.forEach(sub => sub.unsubscribe());
}


onMounted(() => {
  Auth.currentAuthenticatedUser().then(data => {
    user.value = data;
    photosStore.fetchPhotos();
  }).catch(() => {
    // debugger
    // router.push({name: 'login'});
  });
});

onUnmounted(() => {
  hubListenerCancelToken();
});
</script>

<template>
  <div class="dashboard-layout">
    <header>
      <router-link :to="{name: 'dashboard'}">
        <img alt="Vue logo" class="logo" src="@/assets/logo.png"/>
      </router-link>
      <div class="wrapper">
        <!--        <h3>{{ height }}</h3>-->
        <!--      <h3>{{ route.meta?.title }}</h3>-->
        <h3>{{ user.attributes?.email }}</h3>
<!--              <h3>{{ user.username }}</h3>-->
        <router-link class="route-item route-item--profile" :to="{name: 'profile'}">
          <i class="material-symbols-rounded">
            account_box
          </i>
          Profile
        </router-link>
      </div>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" :duration="150" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </main>

    <nav>
      <router-link class="route-item small" :to="{name: 'add-photo'}">
        <i class="material-symbols-rounded">
          add
        </i>
      </router-link>
      <router-link class="route-item" :to="{name: 'dashboard'}">
        <i class="material-symbols-rounded">
          photo_library
        </i>
        Photos
      </router-link>
      <router-link class="route-item" :to="{name: 'store'}">
        <i class="material-symbols-rounded">
          store
        </i>
        Store
      </router-link>
    </nav>

    <router-view class="modal" name="modal" v-slot="{ Component }">
      <transition name="modal">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
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

  > article {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
  }
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
  flex: 1 1 auto;
  justify-content: center;
  row-gap: 5px;
  height: 100%;
  font-size: .8rem;
  width: 100%;

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
