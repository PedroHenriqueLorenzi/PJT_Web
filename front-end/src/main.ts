import './style.css';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Toast from "vue-toastification";
import router from './routes/index.ts';

import App from './App.vue';

const app = createApp(App);

app.use(router)
app.use(createPinia());
app.use(Toast, {
    position: "top-right",
    transition: "my-custom-fade",
    timeout: 3000,
    closeOnClick: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: false,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    newestOnTop: false
})

app.mount('#app');
