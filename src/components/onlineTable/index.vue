<template>
  <div class="page-content">
    <div class="header"></div>
    <div class="table-content">
      <div v-for="(item, idx) in tableData" class="single-line">
        <div
          v-for="(x, index) in item"
          :class="index === 0 || idx === 0 ? 'single-box-first' : 'single-box'"
          :style="idx === 0 ? { width: '35px' } : {}"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
const tableData = ref<Array<any>>([])
const initTable = {
  row: 26,
  line: 64,
}
const initTableData = () => {
  tableData.value = Array(initTable.row).fill([])
  tableData.value = tableData.value.map((el) => {
    el = Array(initTable.line).fill("")
    return el
  })
  console.info(tableData.value)
}
onMounted(() => {
  initTableData()
})
</script>
<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  max-height: 800px;
  overflow: scroll;
  .header {
  }
  .table-content {
    display: flex;
    width: 100%;
    .single-line {
      display: flex;
      flex-direction: column;
    }
    .single-box {
      display: flex;
      height: 25px;
      min-width: 80px;
      margin-right: -1px;
      margin-bottom: -1px;
      border: 1px solid #959595;
      cursor: pointer;
    }
    .single-box-first {
      display: flex;
      min-height: 25px;
      background-color: #ebebeb;
      margin-right: -1px;
      margin-bottom: -1px;
      border: 1px solid #959595;
      cursor: pointer;
    }
  }
}
</style>
