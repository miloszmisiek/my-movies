<script setup>
import { RouterView } from "vue-router";
import { reactive } from "vue";
import Alert from "./components/AlertVue.vue";
import Header from "./components/HeaderVue.vue";

const alertData = reactive({
  alert: "warning",
  message: "Default message",
  alertVisible: false,
});

const setAlertData = (alert, message, visible) => {
  setTimeout(() => {
    alertData.alert = alert;
    alertData.message = message;
    alertData.alertVisible = visible;
  }, 1200);
};
</script>

<template>
  <article>
    <Transition>
      <Alert
        v-if="alertData.alertVisible"
        :data="alertData"
        :setAlertData="setAlertData"
      />
    </Transition>
    <Header />
    <RouterView :setAlertData="setAlertData" />
  </article>
</template>

<style lang="scss">
@import "./assets/styles/main.scss";
</style>
