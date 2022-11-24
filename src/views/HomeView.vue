<script setup>
import { ref } from "vue";
import Table from "../components/TableVue.vue";

const componentKey = ref(0);
const props = defineProps(["setAlertData"]);
const forceRender = () => {
  componentKey.value += 1;
};
</script>

<template>
  <!-- Main -->
  <main>
    <Table
      :key="componentKey"
      :forceRender="forceRender"
      :setAlertData="props.setAlertData"
    />
  </main>
</template>
