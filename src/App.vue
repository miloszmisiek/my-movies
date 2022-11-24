<script setup>
import { RouterView } from "vue-router";
import { reactive } from "vue";
import Alert from "./components/AlertVue.vue";
import Header from "./components/HeaderVue.vue";

const alertData = reactive({
  alert: "warning",
  display: "d-none",
  message: "Default message",
  alertVisible: false,
});

const setAlertData = (alert, display, message, visible) => {
  setTimeout(() => {
    alertData.alert = alert;
    alertData.display = display;
    alertData.message = message;
    alertData.alertVisible = visible;
    window.scrollTo(0, 0);
  }, 1200);
};
</script>

<template>
  <Transition>
    <Alert
      v-if="alertData.alertVisible"
      :data="alertData"
      :setAlertData="setAlertData"
    />
  </Transition>
  <Header />
  <RouterView :setAlertData="setAlertData" />
</template>

<style lang="scss">
@import "./assets/styles/main.scss";
</style>
