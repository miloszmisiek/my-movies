<script setup>
import useVuelidate from "@vuelidate/core";
import { required, between, maxLength } from "@vuelidate/validators";
import BaseInput from "./BaseInput.vue";
import StarRating from "vue-star-rating";
import { nextTick, onMounted, reactive, toRefs } from "vue";
import { axiosRes } from "../api/axiosDefaults";

const fillForm = () => {
  Object.keys(formData).forEach(
    (key) =>
      (formData[key] = Object.entries(props.data).find(
        (prop) => prop[0] === key
      )[1])
  );
};
const props = defineProps(["data", "setAlertData"]);
const emit = defineEmits(["formSubmitted"]);
const initialState = {
  id: null,
  title: "",
  director: "",
  year: "",
  rate: 0,
};
const formData = reactive({ ...initialState });
const { title, director, year, rate } = toRefs(formData);
const rules = {
  title: { required, maxLength: maxLength(200) },
  year: { between: between(1900, 2200) },
};
const v$ = useVuelidate(rules, formData);
const setRating = (rating) => {
  rate.value = rating;
};
const submitForm = async () => {
  const result = await v$.value.$validate();
  if (result) {
    formData.id = props.data.id;
    try {
      await axiosRes.put(`${props.data.id}`, formData);
      document.getElementById("close-btn").click();
      emit("formSubmitted");
    } catch (err) {
      if (err.response?.status !== 401) {
        document.getElementById("close-btn").click();
        props.setAlertData("danger", `${err.message}`, true);
      }
    }
  }
};
const resetForm = async () => {
  const formValues = Object.values(formData);
  const initialVales = Object.values(props.data);

  if (formValues.some((v) => !initialVales.includes(v))) {
    fillForm();
    await nextTick();
    v$.value.$reset();
  }
};
defineExpose({
  resetForm,
});
onMounted(() => {
  fillForm();
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
      {{
        error.$validator === "required"
          ? `${error.$params.max}`
          : error.$message
      }}
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
      <!-- Save Button -->
      <button type="submit" class="btn btn-success">Save</button>
    </div>
  </form>
</template>
