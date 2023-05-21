import { createApp } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import { createPinia } from 'pinia';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import utils from '@/plugins/utils.js';
import App from './App.vue';
import router from './router';



Amplify.configure({...awsExports, ssr: true});

import '@vuepic/vue-datepicker/dist/main.css'
import '@aws-amplify/ui-vue/styles.css';
import './assets/main.scss';



const app = createApp(App);

app.component('VueDatePicker', VueDatePicker);

app.use(createPinia());
app.use(router);
app.use(utils);
app.mount('#app');

