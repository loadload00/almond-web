import { defineStore } from "pinia"

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    sidebarCollapseState: false,
    animateDuration: 300,
    enterAnimate: "animate__fadeInLeft",
    leaveAnimate: "animate__fadeOutRight",
  }),
  actions: {
    onChangeSidebarCollapseState() {
      this.sidebarCollapseState = !this.sidebarCollapseState
    },
    onChangeAnimateDuration(duration: number) {
      this.animateDuration = duration
    },
    onChangeEnterAnimate(animate: string) {
      this.enterAnimate = animate
    },
    onChangeLeaveAnimate(animate: string) {
      this.leaveAnimate = animate
    },
  },
  persist: true,
})
