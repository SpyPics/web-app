import { createApp, nextTick } from 'vue';
import { createPinia } from 'pinia';
import { Amplify, Hub } from 'aws-amplify';
import awsExports from './aws-exports';
import thumbnail from '@/plugins/thumbnail.js';
import App from './App.vue';
import router from './router';

Hub.listen('auth', (data) => {
  const {payload} = data;

  if (payload.event === 'signIn') {
    nextTick(() => router.push({path: '/photos'}));
  }

  if (payload.event === 'signOut') {
    nextTick(() => router.push({path: '/photos'}));
  }
});


Amplify.configure({...awsExports, ssr: true});



import './assets/main.scss';


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(thumbnail);
app.mount('#app');

