<template>
  <div class="page-transition-component" @click="onOpen">
    <i class="iconfont icon-animate"></i>
  </div>

  <el-dialog v-model="visible" title="切换页面过渡动画" width="420px">
    <el-form label-position="top">
      <el-form-item label="动画时长">
        <el-slider :min="100" :max="3000" :step="100" v-model="duration"></el-slider>
      </el-form-item>

      <el-form-item label="进场动画">
        <el-select v-model="enterAnimate" placeholder="请选择进场动画">
          <el-option-group v-for="group in options" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item label="离场动画">
        <el-select v-model="leaveAnimate" placeholder="请选择离场动画">
          <el-option-group v-for="group in options" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store/useSettingsStore"
import { ref } from "vue"

const settingsStore = useSettingsStore()

const visible = ref(false)

const duration = ref<number>(settingsStore.animateDuration)

const enterAnimate = ref<string>(settingsStore.enterAnimate)

const leaveAnimate = ref<string>(settingsStore.leaveAnimate)

const onConfirm = () => {
  settingsStore.onChangeAnimateDuration(duration.value)
  settingsStore.onChangeEnterAnimate(enterAnimate.value)
  settingsStore.onChangeLeaveAnimate(leaveAnimate.value)
  onClose()
}

const onOpen = () => (visible.value = true)

const onClose = () => (visible.value = false)

const options = ref([
  {
    label: "Attention seekers",
    options: [
      {
        label: "animate__bounce",
        value: "animate__bounce",
      },
      {
        label: "animate__flash",
        value: "animate__flash",
      },
      {
        label: "animate__pulse",
        value: "animate__pulse",
      },
      {
        label: "animate__rubberBand",
        value: "animate__rubberBand",
      },
      {
        label: "animate__shakeX",
        value: "animate__shakeX",
      },
      {
        label: "animate__shakeY",
        value: "animate__shakeY",
      },
      {
        label: "animate__headShake",
        value: "animate__headShake",
      },
      {
        label: "animate__swing",
        value: "animate__swing",
      },
      {
        label: "animate__tada",
        value: "animate__tada",
      },
      {
        label: "animate__wobble",
        value: "animate__wobble",
      },
      {
        label: "animate__jello",
        value: "animate__jello",
      },
      {
        label: "animate__heartBeat",
        value: "animate__heartBeat",
      },
    ],
  },
  {
    label: "Back entrances",
    options: [
      {
        label: "animate__backInDown",
        value: "animate__backInDown",
      },
      {
        label: "animate__backInLeft",
        value: "animate__backInLeft",
      },
      {
        label: "animate__backInRight",
        value: "animate__backInRight",
      },
      {
        label: "animate__backInUp",
        value: "animate__backInUp",
      },
    ],
  },
  {
    label: "Back exits",
    options: [
      {
        label: "animate__backOutDown",
        value: "animate__backOutDown",
      },
      {
        label: "animate__backOutLeft",
        value: "animate__backOutLeft",
      },
      {
        label: "animate__backOutRight",
        value: "animate__backOutRight",
      },
      {
        label: "animate__backOutUp",
        value: "animate__backOutUp",
      },
    ],
  },
  {
    label: "Bouncing entrances",
    options: [
      {
        label: "animate__bounceIn",
        value: "animate__bounceIn",
      },
      {
        label: "animate__bounceInDown",
        value: "animate__bounceInDown",
      },
      {
        label: "animate__bounceInLeft",
        value: "animate__bounceInLeft",
      },
      {
        label: "animate__bounceInRight",
        value: "animate__bounceInRight",
      },
      {
        label: "animate__bounceInUp",
        value: "animate__bounceInUp",
      },
    ],
  },
  {
    label: "Bouncing exits",
    options: [
      {
        label: "animate__bounceOut",
        value: "animate__bounceOut",
      },
      {
        label: "animate__bounceOutDown",
        value: "animate__bounceOutDown",
      },
      {
        label: "animate__bounceOutLeft",
        value: "animate__bounceOutLeft",
      },
      {
        label: "animate__bounceOutRight",
        value: "animate__bounceOutRight",
      },
      {
        label: "animate__bounceOutUp",
        value: "animate__bounceOutUp",
      },
    ],
  },
  {
    label: "Fading entrances",
    options: [
      {
        label: "animate__fadeIn",
        value: "animate__fadeIn",
      },
      {
        label: "animate__fadeInDown",
        value: "animate__fadeInDown",
      },
      {
        label: "animate__fadeInDownBig",
        value: "animate__fadeInDownBig",
      },
      {
        label: "animate__fadeInLeft",
        value: "animate__fadeInLeft",
      },
      {
        label: "animate__fadeInLeftBig",
        value: "animate__fadeInLeftBig",
      },
      {
        label: "animate__fadeInRight",
        value: "animate__fadeInRight",
      },
      {
        label: "animate__fadeInRightBig",
        value: "animate__fadeInRightBig",
      },
      {
        label: "animate__fadeInUp",
        value: "animate__fadeInUp",
      },
      {
        label: "animate__fadeInUpBig",
        value: "animate__fadeInUpBig",
      },
      {
        label: "animate__fadeInTopLeft",
        value: "animate__fadeInTopLeft",
      },
      {
        label: "animate__fadeInTopRight",
        value: "animate__fadeInTopRight",
      },
      {
        label: "animate__fadeInBottomLeft",
        value: "animate__fadeInBottomLeft",
      },
      {
        label: "animate__fadeInBottomRight",
        value: "animate__fadeInBottomRight",
      },
    ],
  },
  {
    label: "Fading exits",
    options: [
      {
        label: "animate__fadeOut",
        value: "animate__fadeOut",
      },
      {
        label: "animate__fadeOutDown",
        value: "animate__fadeOutDown",
      },
      {
        label: "animate__fadeOutDownBig",
        value: "animate__fadeOutDownBig",
      },
      {
        label: "animate__fadeOutLeft",
        value: "animate__fadeOutLeft",
      },
      {
        label: "animate__fadeOutLeftBig",
        value: "animate__fadeOutLeftBig",
      },
      {
        label: "animate__fadeOutRight",
        value: "animate__fadeOutRight",
      },
      {
        label: "animate__fadeOutRightBig",
        value: "animate__fadeOutRightBig",
      },
      {
        label: "animate__fadeOutUp",
        value: "animate__fadeOutUp",
      },
      {
        label: "animate__fadeOutUpBig",
        value: "animate__fadeOutUpBig",
      },
      {
        label: "animate__fadeOutTopLeft",
        value: "animate__fadeOutTopLeft",
      },
      {
        label: "animate__fadeOutTopRight",
        value: "animate__fadeOutTopRight",
      },
      {
        label: "animate__fadeOutBottomRight",
        value: "animate__fadeOutBottomRight",
      },
      {
        label: "animate__fadeOutBottomLeft",
        value: "animate__fadeOutBottomLeft",
      },
    ],
  },
  {
    label: "Flippers",
    options: [
      {
        label: "animate__flip",
        value: "animate__flip",
      },
      {
        label: "animate__flipInX",
        value: "animate__flipInX",
      },
      {
        label: "animate__flipInY",
        value: "animate__flipInY",
      },
      {
        label: "animate__flipOutX",
        value: "animate__flipOutX",
      },
      {
        label: "animate__flipOutY",
        value: "animate__flipOutY",
      },
    ],
  },
  {
    label: "Lightspeed",
    options: [
      {
        label: "animate__lightSpeedInRight",
        value: "animate__lightSpeedInRight",
      },
      {
        label: "animate__lightSpeedInLeft",
        value: "animate__lightSpeedInLeft",
      },
      {
        label: "animate__lightSpeedOutRight",
        value: "animate__lightSpeedOutRight",
      },
      {
        label: "animate__lightSpeedOutLeft",
        value: "animate__lightSpeedOutLeft",
      },
    ],
  },
  {
    label: "Rotating entrances",
    options: [
      {
        label: "animate__rotateIn",
        value: "animate__rotateIn",
      },
      {
        label: "animate__rotateInDownLeft",
        value: "animate__rotateInDownLeft",
      },
      {
        label: "animate__rotateInDownRight",
        value: "animate__rotateInDownRight",
      },
      {
        label: "animate__rotateInUpLeft",
        value: "animate__rotateInUpLeft",
      },
      {
        label: "animate__rotateInUpRight",
        value: "animate__rotateInUpRight",
      },
    ],
  },
  {
    label: "Rotating exits",
    options: [
      {
        label: "animate__rotateOut",
        value: "animate__rotateOut",
      },
      {
        label: "animate__rotateOutDownLeft",
        value: "animate__rotateOutDownLeft",
      },
      {
        label: "animate__rotateOutDownRight",
        value: "animate__rotateOutDownRight",
      },
      {
        label: "animate__rotateOutUpLeft",
        value: "animate__rotateOutUpLeft",
      },
      {
        label: "animate__rotateOutUpRight",
        value: "animate__rotateOutUpRight",
      },
    ],
  },
  {
    label: "Specials",
    options: [
      {
        label: "animate__hinge",
        value: "animate__hinge",
      },
      {
        label: "animate__jackInTheBox",
        value: "animate__jackInTheBox",
      },
      {
        label: "animate__rollIn",
        value: "animate__rollIn",
      },
      {
        label: "animate__rollOut",
        value: "animate__rollOut",
      },
    ],
  },
  {
    label: "Zooming entrances",
    options: [
      {
        label: "animate__zoomIn",
        value: "animate__zoomIn",
      },
      {
        label: "animate__zoomInDown",
        value: "animate__zoomInDown",
      },
      {
        label: "animate__zoomInLeft",
        value: "animate__zoomInLeft",
      },
      {
        label: "animate__zoomInRight",
        value: "animate__zoomInRight",
      },
      {
        label: "animate__zoomInUp",
        value: "animate__zoomInUp",
      },
    ],
  },
  {
    label: "Zooming exits",
    options: [
      {
        label: "animate__zoomOut",
        value: "animate__zoomOut",
      },
      {
        label: "animate__zoomOutDown",
        value: "animate__zoomOutDown",
      },
      {
        label: "animate__zoomOutLeft",
        value: "animate__zoomOutLeft",
      },
      {
        label: "animate__zoomOutRight",
        value: "animate__zoomOutRight",
      },
      {
        label: "animate__zoomOutUp",
        value: "animate__zoomOutUp",
      },
    ],
  },
  {
    label: "Sliding entrances",
    options: [
      {
        label: "animate__slideInDown",
        value: "animate__slideInDown",
      },
      {
        label: "animate__slideInLeft",
        value: "animate__slideInLeft",
      },
      {
        label: "animate__slideInRight",
        value: "animate__slideInRight",
      },
      {
        label: "animate__slideInUp",
        value: "animate__slideInUp",
      },
    ],
  },
  {
    label: "Sliding exits",
    options: [
      {
        label: "animate__slideOutDown",
        value: "animate__slideOutDown",
      },
      {
        label: "animate__slideOutLeft",
        value: "animate__slideOutLeft",
      },
      {
        label: "animate__slideOutRight",
        value: "animate__slideOutRight",
      },
      {
        label: "animate__slideOutUp",
        value: "animate__slideOutUp",
      },
    ],
  },
])
</script>

<style lang="scss" scoped>
.page-transition-component {
  padding: 8px;

  ::v-deep(.el-dialog) {
    .el-select {
      width: 100%;
    }
  }
}
</style>
