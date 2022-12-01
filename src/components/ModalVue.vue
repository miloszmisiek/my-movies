<script setup>
import { reactive } from "vue";
import Alert from "./AlertVue.vue";

const props = defineProps([
  "data",
  "editMode",
  "deleteMode",
  "deleteMovie",
  "alertData",
]);

const alertData = reactive({
  alert: "warning",
  display: "d-block",
  message: "Default message",
  alertVisible: false,
});
</script>
<template>
  <!-- Modal -->
  <div
    class="modal fade"
    ref="modal"
    id="mainModal"
    tabindex="-1"
    aria-labelledby="mainModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" @scroll.passive="onScroll">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header text-uppercase">
          <!-- Header Slot -->
          <slot name="header" />
          <!-- Close Button -->
          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Close"
            data-bs-dismiss="modal"
            id="close-btn"
          ></button>
        </div>
        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Body Slot -->
          <slot name="body" />
          <!-- Delete Modal Footer -->
          <div v-if="props.deleteMode" class="modal-footer">
            <!-- Close Button -->
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <!-- Delete Button -->
            <button
              @click="
                props.deleteMovie(props.data.id),
                  $emit('update:formSubmit', true)
              "
              class="btn btn-danger"
            >
              Delete
            </button>
          </div>
          <!-- Modal Alert -->
          <Alert v-if="alertData.alertVisible" :data="alertData" />
        </div>
      </div>
    </div>
  </div>
</template>
