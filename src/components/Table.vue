<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios';
import useVuelidate from '@vuelidate/core'
import { required, between, maxLength } from '@vuelidate/validators'

const el = ref()

onMounted(() => {
    axios.get('https://localhost:7151/api/mymovies/')
        .then(res => el.value = res.data)
})



</script>

<template>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Director</th>
                <th scope="col">Year</th>
                <th scope="col">Rate</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in el" :key="item.id">
                <th scope="row">{{ item.id }}</th>
                <td>{{ item.title }}</td>
                <td>{{ item.director }}</td>
                <td>{{ item.year }}</td>
                <td>{{ item.rate.toFixed(2) }}</td>
                <td> <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#exampleModal" data-title="edit">
                        Edit
                    </button>

                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal"
                        data-title="delete">
                        Delete
                        <!-- <font-awesome-icon icon="fas fa-plus" /> -->
                    </button>
                </td>
            </tr>
            <!-- <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
            </tr> -->
        </tbody>
    </table>
</template>