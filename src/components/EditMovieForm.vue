<script setup>
import useVuelidate from "@vuelidate/core";
import { required, between, maxLength } from "@vuelidate/validators";
import BaseInput from "./BaseInput.vue";
import StarRating from "vue-star-rating";
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios";

onMounted(() => {
  Object.keys(formData).forEach(
    (key) =>
      (formData[key] = Object.entries(props.data).find(
        (prop) => prop[0] === key
      )[1])
  );
});
const props = defineProps(["data", "setAlertData"]);
const emit = defineEmits(["formSubmitted"]);
const formData = reactive({
  id: null,
  title: "",
  director: "",
  year: "",
  rate: 0,
});
const { title, director, year, rate } = toRefs(formData);
const rules = {
  title: { required, maxLength: maxLength(200) },
  year: { between: between(1900, 2200) },
};
const v$ = useVuelidate(rules, formData);
const setRating = (rating) => {
  formData.rate = rating;
};
const submitForm = async () => {
  const result = await v$.value.$validate();
  if (result) {
    formData.id = props.data.id;
    try {
      await axios.put(
        `https://mymovies-task.azurewebsites.net/${props.data.id}`,
        formData
      );
      document.getElementById("close-btn").click();
      emit("formSubmitted");
    } catch (err) {
      if (err.response?.status !== 401) {
        console.log(err.response.data);
      }
    }
  }
};
</script>

<template>
  <form @submit.prevent="submitForm()">
    <!-- Title -->
    <BaseInput v-model="title" label="Title" />
    <div
      class="alert alert-warning"
      role="alert"
      v-for="error in v$.title.$errors"
      :key="error.$uid"
    >
      {{ error.$message }}
    </div>
    <!-- Director -->
    <BaseInput v-model="director" label="Director" />
    <!-- Year -->
    <BaseInput v-model="year" type="number" label="Year" />
    <div
      class="alert alert-warning"
      role="alert"
      v-for="error in v$.year.$errors"
      :key="error.$uid"
    >
      {{ error.$message }}
    </div>
    <!-- Rate -->
    <label for="star-rating">Rate</label>
    <star-rating
      v-model:rating="rate"
      v-bind:increment="0.5"
      v-bind:max-rating="10"
      animate
      inactive-color="#A9A9A9"
      active-color="#e4c000"
      v-bind:star-size="20"
      @update:rating="setRating"
      id="star-rating"
    >
    </star-rating>
    <!-- Footer -->
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
        Close
      </button>
      <button type="submit" class="btn btn-success">Save</button>
    </div>
  </form>
</template>
