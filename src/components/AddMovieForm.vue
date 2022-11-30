<script setup>
import useVuelidate from "@vuelidate/core";
import { required, between, maxLength } from "@vuelidate/validators";
import BaseInput from "./BaseInput.vue";
import StarRating from "vue-star-rating";
import { nextTick, onMounted, reactive, toRefs } from "vue";
import { axiosRes } from "../api/axiosDefaults";

const props = defineProps(["setAlertData"]);
const emit = defineEmits(["formSubmitted"]);

const initialState = {
  title: "",
  director: "",
  year: "",
  rate: 0,
};
const yearLimits = [1900, 2200];
const rules = {
  title: { required, maxLength: maxLength(200) },
  year: { required, between: between(...yearLimits) },
};
const formData = reactive({ ...initialState });
const { title, director, year, rate } = toRefs(formData);
const v$ = useVuelidate(rules, formData);

const resetForm = async () => {
  Object.assign(formData, initialState);
  await nextTick();
  v$.value.$reset();
};

const setRating = (rating) => {
  rate.value = rating;
};

const submitForm = async () => {
  const result = await v$.value.$validate();
  if (result) {
    try {
      await axiosRes.post("", formData);
      document.getElementById("close-btn").click();
      emit("formSubmitted");
    } catch (err) {
      if (err.response?.status !== 401) {
        document.getElementById("close-btn").click();
        props.setAlertData("danger", `${err.message}`, true);
        console.log(err.message);
      }
    }
  }
};
defineExpose({
  resetForm,
});
onMounted(() => {
  resetForm();
});
</script>

<template>
  <form @submit.prevent="submitForm()">
    <!-- Title -->
    <BaseInput
      v-model="title"
      label="Title"
      :class="!!v$.title.$errors.length ? 'error' : undefined"
    />
    <!-- Title Errors Handler -->
    <div
      class="text-danger mb-2"
      v-for="error in v$.title.$errors"
      :key="error.$uid"
    >
      {{
        error.$validator === "required"
          ? `${
              error.$property.charAt(0).toUpperCase() + error.$property.slice(1)
            } is
            required!`
          : `Maximum length of this field is
            ${error.$params.max}!`
      }}
    </div>
    <!-- Director -->
    <BaseInput v-model="director" label="Director" />
    <!-- Year -->
    <BaseInput
      v-model="year"
      type="number"
      label="Year"
      :class="!!v$.year.$errors.length ? 'error' : undefined"
    />
    <!-- Year Errors Handler -->
    <div
      class="text-danger mb-2"
      role="alert"
      v-for="error in v$.year.$errors"
      :key="error.$uid"
    >
      {{ `The value must be between ${yearLimits[0]} and ${yearLimits[1]} ` }}
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
      <!-- Close Button -->
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
        Close
      </button>
      <!-- Submit Button -->
      <button type=" submit" class="btn btn-success">Submit</button>
    </div>
  </form>
</template>
