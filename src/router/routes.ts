import { RouteRecordRaw } from "vue-router"
import Layout from "@/components/layout/index.vue"

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/redirect/:path(.*)",
    name: "redirect",
    component: () => import("@/views/redirect/index.vue"),
  },
]

export const asyncRouter: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          icon: "home",
        },
      },
      {
        path: "/home2",
        name: "home2",
        component: () => import("@/views/error/index.vue"),
        meta: {
          title: "首页",
          icon: "home",
        },
      },
    ],
  },
]

export const errorRouter: RouteRecordRaw[] = [
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/index.vue"),
  },
  { path: "/:pathMatch(.*)", redirect: "/404" },
]
