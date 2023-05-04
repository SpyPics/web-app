import { createSSRApp, nextTick } from 'vue';
import { createPinia } from 'pinia';
import { Amplify, Hub } from 'aws-amplify';
import App from './App.vue';
import { createRouter } from './router';


import awsExports from './aws-exports';

Amplify.configure({...awsExports, ssr: true});

import './assets/main.scss';

export function createApp(req) {
  Hub.listen('auth', (data) => {
    const {payload} = data;

    if (payload.event === 'signIn') {
      nextTick(() => router.push({path: '/photos'}));
    }

    if (payload.event === 'signOut') {
      nextTick(() => router.push({path: '/photos'}));
    }
  });

  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);
  const router = createRouter(req);
  app.use(router);
  return {app, router};
}

