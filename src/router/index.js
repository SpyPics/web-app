import { nextTick } from 'vue';
import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import { Auth, withSSRContext } from 'aws-amplify';
import PhotosView from '../views/PhotosView.vue';
import ProfileView from '../views/ProfileView.vue';
import PhotoFormModal from '@/components/PhotoFormModal.vue';
import LoginComponent from '@/components/LoginComponent.vue';

export function createRouter(req) {
  const router = _createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        redirect: '/photos'
      },
      {
        path: '/photos/new',
        name: 'photos/new',
        meta: {
          title: 'Photos'
        },
        components: {
          default: PhotosView,
          modal: PhotoFormModal
        },
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
        component: ProfileView
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
    if (import.meta.env.SSR) {
      return withSSRContext({req}).Auth.currentAuthenticatedUser().then((data) => {
        return data;
      }).catch(() => {
        return false;
      });
    }

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
    if (!import.meta.env.SSR) {
      nextTick(() => {
        document.title = to.meta?.title || 'SpyPics';
      });
    }
  });

  return router;
}
