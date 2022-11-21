<script setup>
import { reactive, ref } from 'vue';
import Table from '../components/Table.vue';

const componentKey = ref(0)

const props = defineProps(['setAlertData'])

const forceRender = () => {
  componentKey.value += 1
}

</script>

<template>
  <main>
    <Table :key='componentKey' :forceRender="forceRender" :setAlertData="props.setAlertData" />
  </main>
</template>
