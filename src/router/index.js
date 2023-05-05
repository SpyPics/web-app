import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { Auth } from 'aws-amplify';
import PhotosView from '../views/PhotosView.vue';
import ProfileView from '../views/ProfileView.vue';
import PhotoFormModal from '@/components/PhotoModal.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import ProfileModal from '@/components/ProfileModal.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

      // children: [
      //   {
      //     // UserProfile will be rendered inside User's <router-view>
      //     // when /user/:id/profile is matched
      //     path: 'profile',
      //     component: UserProfile,
      //   },
      //   {
      //     // UserPosts will be rendered inside User's <router-view>
      //     // when /user/:id/posts is matched
      //     path: 'posts',
      //     component: UserPosts,
      //   },
      // ],
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
      component: () => import('../views/StoreView.vue')
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
      component: LoginComponent
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
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = to.meta?.title || 'SpyPics';
  });
});
export default router;
