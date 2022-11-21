<script setup>
import { RouterLink, RouterView } from "vue-router";
import { reactive } from 'vue';
import Alert from './components/Alert.vue';
import Header from "./components/Header.vue";

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
  <Transition>
    <Alert v-if="alertData.alertVisible" :data="alertData" :setAlertData="setAlertData" />
  </Transition>
  <Header />
  <RouterView :setAlertData="setAlertData" />
</template>

<style lang="scss">
@import "./assets/styles/style.scss";
</style>