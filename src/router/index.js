import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { Auth } from 'aws-amplify';
import PhotosView from '../views/PhotosView.vue';
import PhotoFormModal from '@/components/PhotoModal.vue';
import StoreView from '@/views/StoreView.vue';
import HomeView from '@/views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
import AuthView from '@/views/AuthView.vue';
import SellModal from '@/components/SellModal.vue';
import BuyView from '@/views/BuyView.vue';
import SuccessView from '@/views/SuccessView.vue';
import ProfileModal from '@/components/ProfileModal.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'SpyPics',
        public: true
      },
      component: HomeView
    },
    {
      path: '/buy/:id',
      name: 'buy-photo',
      meta: {
        title: 'Purchase photo',
        public: true
      },
      component: BuyView,
      props: true
    },
    {
      path: '/success/:sessionId',
      name: 'success',
      meta: {
        title: 'Success',
        public: true
      },
      component: SuccessView,
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
          components: {
            modal: ProfileModal
          },
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
  if (to.path === '/' || to.meta?.public) {
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
