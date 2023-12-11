<template>
  <div class="login-container">
    <div class="form-container">
      <el-input v-model="url" placeholder="server url" style="margin-bottom: 20px" />
      <el-form ref="formRef" :model="loginForm" :rules="rules" size="large">
        <el-form-item prop="roomId">
          <el-input v-model="loginForm.roomId" maxlength="6" placeholder="Please input room id" />
        </el-form-item>
        <div class="code-container">
          <el-form-item class="email-code" prop="username">
            <el-input v-model="loginForm.username" maxlength="8" placeholder="Please input your name" />
          </el-form-item>
        </div>
        <el-button class="login-btn" type="primary" @click="onSubmit">Login</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ILoginForm } from "@/entity/type"
import { reactive, ref } from "vue"
import { FormInstance, FormRules, ElMessage } from 'element-plus';
import { useThrottleFn } from "@vueuse/core"
import { session } from "@/utils/storage"

const router = useRouter()

const url = ref("")

const formRef = ref<FormInstance>()

const loginForm = reactive<ILoginForm>({ roomId: "", username: "" })

const rules = reactive<FormRules<ILoginForm>>({
  roomId: [{ required: true, type: "string", message: "Please input room id", trigger: "blur" }],
  username: [{ required: true, type: "string", message: "Please input name", trigger: "blur" }],
})

const onSubmit = useThrottleFn(async () => {
  if (document.location.protocol === "http:") {
    ElMessage.error("please visit with https")
    return
  }
  formRef.value?.validate((valid) => {
    if (valid) {
      session.set("roomId", loginForm.roomId)
      session.set("username", loginForm.username)
      session.set("userId", "")
      session.set("server", url.value)
      router.push({
        name: "home",
      })
    }
  })
}, 1000)
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
