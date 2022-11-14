<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios';
import useVuelidate from '@vuelidate/core'
import { required, between, maxLength } from '@vuelidate/validators'
import BaseInput from './BaseInput.vue';

const props = defineProps(['title', 'body'])
const formData = reactive({
    title: "",
    director: "",
    year: null,
    rate: null,
});
const rules = {
    title: { required, maxLength: maxLength(200), },
    year: { between: between(1900, 2200) },
}
const v$ = useVuelidate(rules, formData);
const submitForm = async () => {
    const result = await v$.value.$validate();
    if (result) {
        alert("success, form submitted!");
        try {
            await axios.post("https://localhost:7151/api/mymovies/", formData);
        } catch (err) {
            if (err.response?.status !== 401) {
                console.log(err.response.data);
            }
        }
        console.log(formData);
    }
};

</script>
<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add movie</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="submitForm">
                    <div class="modal-body">
                        <BaseInput v-model="formData.title" label="Title" />
                        <div class="alert alert-warning" role="alert" v-for="error in v$.title.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </div>
                        <BaseInput v-model="formData.director" label="Director" />
                        <BaseInput v-model="formData.year" type="number" label="Year" />
                        <div class="alert alert-warning" role="alert" v-for="error in v$.year.$errors"
                            :key="error.$uid">
                            {{ error.$message }}
                        </div>
                        <BaseInput v-model="formData.rate" type="number" label="Rate" step="0.01" min="0" />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>