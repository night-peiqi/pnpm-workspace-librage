import { createApp } from "vue";
import App from './app.vue'
import CQButton from "@cq/components/button";
import CQIcon from "@cq/components/icon";

const app = createApp(App)

app.use(CQButton).use(CQIcon)
app.mount('#app')