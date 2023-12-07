import { createRouter as Router, createWebHashHistory } from "vue-router"
import { constantRoutes, asyncRouter, errorRouter } from "./routes"
import { session } from "@/utils/storage"

const createRouter = () =>
  Router({
    history: createWebHashHistory(),
    scrollBehavior: () => ({ top: 0 }),
    routes: [...constantRoutes, ...asyncRouter, ...errorRouter],
  })

const router = createRouter()

router.beforeEach((to, from, next) => {
  const roomId = session.get("roomId")
  const username = session.get("username")
  if (roomId && username) {
    next()
  } else if (to.name !== "login") {
    next({ name: "login" })
  } else {
    next()
  }
})

export const resetRouter = () => {
  const newRouter = createRouter()
  ;(router as any).matcher = (newRouter as any).matcher
}

export default router
