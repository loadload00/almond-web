import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import pinia from "./store"
import "@/styles/index.scss"
import "normalize.css"
import "animate.css"
import zhCn from "element-plus/es/locale/lang/zh-cn"

if (import.meta.env.MODE === "development") {
  import("element-plus/dist/index.css")
}

const app = createApp(App)

const defaultInstallOpt = app.config.globalProperties.$ELEMENT
app.config.globalProperties.$ELEMENT = { ...defaultInstallOpt, locale: zhCn }

app.use(pinia).use(router).mount("#app")
