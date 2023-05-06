import { nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { Auth } from 'aws-amplify';
import PhotosView from '../views/PhotosView.vue';
import PhotoFormModal from '@/components/PhotoModal.vue';
import TheWelcome from '@/components/TheWelcome.vue';
import ProfileModal from '@/components/ProfileModal.vue';
import StoreView from '@/views/StoreView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/photos'
    },
    {
      path: '/add-photo',
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
      path: '/edit-photo/:id',
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
      path: '/photos',
      name: 'photos',
      meta: {
        title: 'Photos'
      },
      component: PhotosView,
    },
    {
      path: '/store',
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
      path: '/profile',
      name: 'profile',
      meta: {
        title: 'Profile'
      },
      components: {
        default: PhotosView,
        modal: ProfileModal
      },
    },
    {
      path: '/login',
      name: 'login',
      meta: {},
      component: TheWelcome
    }
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
  if (to.path === '/') {
    return true;
  }

  const user = await getUser();
  if (to.path !== '/login' && !user) {
    return '/login';
  }

  if (to.path === '/login' && user) {
    return '/photos';
  }
});

router.afterEach((to, from) => {
  nextTick(() => {
    document.title = to.meta?.title || 'SpyPics';
  });
});
export default router;
