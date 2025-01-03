import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import { useAuth } from "@/composables/useAuth";

const app = createApp(App)

const { updateAuthState } = useAuth();
updateAuthState();

app.use(router)

app.mount('#app')