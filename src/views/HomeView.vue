<script setup>
import Modal from '../components/Modal.vue';
import Table from '../components/Table.vue';
</script>

<template>
  <main>
    <Modal />
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Add
      <font-awesome-icon icon="plus" />
    </button>
    <Table />
  </main>
</template>
