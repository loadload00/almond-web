import { defineStore } from "pinia"
import { asyncRouter } from "@/router/routes"

export const usePermissionStore = defineStore("permissionStore", {
  state: () => ({
    routes: asyncRouter[0].children ?? [],
  }),
})
