import { nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { Auth } from 'aws-amplify';
import PhotosView from '../views/PhotosView.vue';
import PhotoFormModal from '@/components/PhotoModal.vue';
// import TheWelcome from '@/components/TheWelcome.vue';
// import ProfileModal from '@/components/ProfileView.vue';
import StoreView from '@/views/StoreView.vue';
import HomeView from '@/views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
import AuthView from '@/views/AuthView.vue';
import ProfileView from '@/views/ProfileView.vue';
import SellModal from '@/components/SellModal.vue';
import BuyView from '@/views/BuyView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'SpyPics'
      },
      component: HomeView
    },
    {
      path: '/buy/:id',
      name: 'buy-photo',
      meta: {
        title: 'Purchase photo'
      },
      component: BuyView,
      props: true
    },
    {
      path: '/dashboard',
      meta: {
        title: 'SpyPics'
      },
      component: DashboardView,
      children: [
        {
          path: '',
          name: 'dashboard',
          meta: {
            title: 'Photos'
          },
          component: PhotosView,
        },
        {
          path: 'add-photo',
          name: 'add-photo',
          meta: {
            title: 'Add Photo'
          },
          components: {
            default: PhotosView,
            modal: PhotoFormModal
          },
        },
        {
          path: 'edit-photo/:id',
          name: 'edit-photo',
          meta: {
            title: 'Edit Photo'
          },
          components: {
            default: PhotosView,
            modal: PhotoFormModal
          },
          props: {
            default: false,
            modal: true
          }
        },
        {
          path: 'sell-photo/:id',
          name: 'sell-photo',
          meta: {
            title: 'Sell Photo'
          },
          components: {
            // default: StoreView,
            modal: SellModal
          },
          props: {
            default: false,
            modal: true
          }
        },
        {
          path: 'store',
          name: 'store',
          meta: {
            title: 'Store'
          },
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: StoreView
        },
        {
          path: 'profile',
          name: 'profile',
          meta: {
            title: 'Profile'
          },
          component: ProfileView,
        },
        {
          path: 'auth',
          name: 'auth',
          meta: {},
          component: AuthView
        }
      ]
    },

  ]
});

function getUser() {
  return Auth.currentAuthenticatedUser().then((data) => {
    return data;
  }).catch(() => {
    return false;
  });
}

router.beforeEach(async (to, from) => {
  if (to.path === '/' || to.name === 'buy-photo') {
    return true;
  }

  const user = await getUser();
  if (user) {
    if (to.name === 'auth') {
      return {name: 'dashboard'};
    }
  } else if (to.name !== 'auth') {
    return {name: 'auth'};
  }

  return true;
});

router.afterEach((to, from) => {
  nextTick(() => {
    document.title = to.meta?.title || 'SpyPics';
  });
});
export default router;
