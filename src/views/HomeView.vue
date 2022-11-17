<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import Alert from '../components/Alert.vue';
import Table from '../components/Table.vue';

let componentKey = ref(0)

const forceRender = () => {
  componentKey.value += 1
}

const alertData = reactive({
  alert: "warning",
  display: 'd-none',
  message: "Default message",
  alertVisible: false,
})

const setAlertData = (alert, display, message, visible) => {
  alertData.alert = alert;
  alertData.display = display
  alertData.message = message
  alertData.alertVisible = visible
}

</script>

<template>
  <main>
    <Alert v-if="alertData.alertVisible" :data="alertData" :setAlertData="setAlertData" />
    <Table :key='componentKey' :forceRender="forceRender" :setAlertData="setAlertData" />
  </main>
</template>
