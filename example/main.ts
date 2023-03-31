import { createApp } from "vue";
import App from './app.vue'
import CQButton from "@cq/components/button";
import CQIcon from "@cq/components/icon";
import '@cq/theme-chalk/index.scss'

const app = createApp(App)

app.use(CQButton).use(CQIcon)
app.mount('#app')