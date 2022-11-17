<script setup>
import { ref } from 'vue';
import Table from '../components/Table.vue';


let componentKey = ref(0)

const forceRender = () => {
  componentKey.value += 1
}

</script>

<template>
  <main>
    <Table :key='componentKey' :forceRender="forceRender" />
  </main>
</template>
