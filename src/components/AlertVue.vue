<script setup>
import { onMounted } from "vue";
const props = defineProps(["data", "setAlertData"]);
onMounted(() => {
  setTimeout(() => {
    // After 3 seconds set the show value to false
    props.setAlertData(...Array(3), false);
  }, 3000);
});
</script>

<template>
  <!-- Alert -->
  <div
    :class="
      'alert fade show alert-' + props.data.alert + ' ' + props.data.display
    "
    role="alert"
  >
    {{ props.data.message }}
  </div>
</template>
