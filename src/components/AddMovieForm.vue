<script setup>
import useVuelidate from '@vuelidate/core'
import { required, between, maxLength } from '@vuelidate/validators'
import BaseInput from './BaseInput.vue';
import StarRating from 'vue-star-rating'
import { reactive, toRefs } from 'vue';
import axios from 'axios';

const emit = defineEmits(['formSubmitted'])

const props = defineProps(['setAlertData', 'formSubmit'])

const formData = reactive({
    title: "",
    director: "",
    year: "",
    rate: 0
});
const { title, director, year, rate } = toRefs(formData)
const rules = {
    title: { required, maxLength: maxLength(200), },
    year: { between: between(1900, 2200) },
}
const v$ = useVuelidate(rules, formData);

const setRating = (rating) => {
    formData.rate = rating;
}

const submitForm = async () => {
    const result = await v$.value.$validate();
    if (result) {
        try {
            await axios.post("https://localhost:7151/api/mymovies/", formData);
            document.getElementById('close-btn').click()
            emit('formSubmitted')
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
        <BaseInput v-model="title" label="Title" />
        <div class="alert alert-warning" role="alert" v-for="error in v$.title.$errors" :key="error.$uid">
            {{ error.$message }}
        </div>
        <BaseInput v-model="director" label="Director" />
        <BaseInput v-model="year" type="number" label="Year" />
        <div class="alert alert-warning" role="alert" v-for="error in v$.year.$errors" :key="error.$uid">
            {{ error.$message }}
        </div>
        <label for="star-rating">Rate</label>
        <star-rating v-model:rating="rate" v-bind:increment="0.5" v-bind:max-rating="10" animate
            inactive-color="#A9A9A9" active-color="#e4c000" v-bind:star-size="20" @update:rating="setRating"
            id="star-rating">
        </star-rating>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success">Submit</button>
        </div>
    </form>
</template>