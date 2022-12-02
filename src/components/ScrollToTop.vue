<script setup>
import { onMounted, ref } from "vue";

const isVisible = ref(false);

const onScroll = () => {
  isVisible.value = window.scrollY > 50;
};
const toTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});
</script>
<template>
  <!-- Scroll On Top Button -->
  <button v-show="isVisible" class="scroll_on_top" @click="toTop">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      stroke-width="1"
      stroke-linecap="square"
      stroke-linejoin="arcs"
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  </button>
</template>
