import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"
import "./style.css"

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

import { useAuthStore } from "@/stores/auth"
useAuthStore(pinia).ensureAuthReady()

app.mount("#app")
