<template>
  <div class="userinfo-component">
    <el-dropdown>
      <template #default>
        <el-avatar :size="40" :src="avatarImg"></el-avatar>
      </template>

      <template #dropdown>
        <el-dropdown-menu class="user-box">
          <div class="user-info">
            <el-avatar :size="80" :src="avatarImg"></el-avatar>
            <div class="username">{{ username }}</div>
          </div>

          <div class="action-box">
            <div class="action-btn" @click="onLogout">
              <i class="iconfont icon-logout"></i>
              <span class="action-text">Exit</span>
            </div>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { session } from "@/utils/storage"

const router = useRouter()

const username = ref()

const avatarImg = ref(`${window.origin}/jj.jpg`)

const onLogout = () => {
  session.set("userId", "")
  session.set("roomId", "")
  session.set("userId", "")
  router.replace({ name: "login" })
}

onMounted(() => {
  username.value = session.get("username")
})
</script>

<style lang="scss" scoped>
.userinfo-component {
  padding: 0 8px;
}

.user-box {
  width: 320px;
  background: transparent;
  margin-bottom: 0;
  padding: 0;
  border-radius: 4px;
  overflow: hidden;

  .user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 24px 16px 24px 16px;
    background: url("@/assets/images/user-bg.png") no-repeat;
    background-size: 100% 100%;

    .el-avatar {
      flex: 0 0 auto;
    }

    .username {
      flex: 1;
      font-size: 16px;
      color: #fff;
      margin-left: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .action-box {
    padding: 16px;

    .action-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 12px 0;
      cursor: pointer;

      .action-text {
        padding-left: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>
