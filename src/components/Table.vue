<script setup>
import axios from 'axios';
import { onMounted, reactive, watch } from 'vue'
import Modal from '../components/Modal.vue';
import AddMovieForm from './AddMovieForm.vue';
import EditMovieForm from './EditMovieForm.vue';

const props = defineProps(['forceRender', 'extMovies', 'setAlertData'])

const movies = reactive({ myMovies: [] })

const fetchMovies = async () => {
    await axios.get('https://localhost:7151/api/mymovies/')
        .then(res => movies.myMovies = res.data)
}

const downloadMovies = async () => {
    try {
        const { data } = await axios.get('https://localhost:7151/api/mymovies/download')
        const results = data.filter(o1 => !JSON.parse(JSON.stringify(movies.myMovies))
            .some(o2 => (o1.title === o2.title && o1.director === o2.director)));
        results.forEach(async obj => await axios.post('https://localhost:7151/api/mymovies/', obj))

        if (results.length) {
            movies.myMovies = [...movies.myMovies, ...results];
            props.setAlertData("success", "d-block", "Movies list updated!", true)
        } else { props.setAlertData("warning", "d-block", "No new movies!", true) }

    } catch (err) {
        console.log(err.response?.data)
    }
}

const deleteMovie = async (id) => {
    await axios.delete(`https://localhost:7151/api/mymovies/${id}`)
    document.getElementById('close-btn').click()
}
onMounted(() => {
    fetchMovies();
})

const modalVar = reactive({
    modalData: null,
    editData: null,
    editMode: false,
    deleteMode: false,
    formSubmit: false,
});

const openModal = (data) => {
    modalVar.editMode = false
    modalVar.deleteMode = true
    modalVar.modalData = data
}

const editModal = (data) => {
    modalVar.deleteMode = false
    modalVar.editMode = true;
    modalVar.editData = data
}

const addMovie = () => {
    modalVar.deleteMode = false
    modalVar.editMode = false;
}

const logHidden = () => {
    if (modalVar.formSubmit) {
        props.forceRender()
        modalVar.formSubmit = false
    }
}


</script>

<template>
    <Modal :data="modalVar.modalData" :editMode='modalVar.editMode' :deleteMode="modalVar.deleteMode"
        :modalHidden="logHidden" :deleteMovie="deleteMovie" v-model:formSubmit="modalVar.formSubmit"
        :setAlertData="props.setAlertData">
        <template v-slot:header>
            <h1 v-if="modalVar.editMode" class="modal-title fs-5" id="exampleModalLabel">Edit movie</h1>
            <h1 v-else-if="modalVar.deleteMode" class="modal-title fs-5" id="exampleModalLabel">Delete movie</h1>
            <h1 v-else class="modal-title fs-5" id="exampleModalLabel">Add movie</h1>
        </template>
        <template v-slot:body>
            <EditMovieForm :key="modalVar.editData?.id" v-if="modalVar.editMode" :data="modalVar.editData"
                v-model:formSubmit="modalVar.formSubmit" />
            <p v-else-if="modalVar.deleteMode">Are you sure you want to delete {{ modalVar.modalData.title }}?</p>
            <AddMovieForm v-else v-model:formSubmit="modalVar.formSubmit" />
        </template>
    </Modal>
    <button type="button" @click="downloadMovies" class="btn btn-secondary">
        Download movies
    </button>
    <button type="button" @click="addMovie" class="btn btn-success" data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        Add
        <font-awesome-icon icon="plus" />
    </button>
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
            <tr v-for="(item, idx) of movies.myMovies" :key="item.id">
                <th scope="row">{{ idx + 1 }}</th>
                <td>{{ item.title }}</td>
                <td>{{ item.director }}</td>
                <td>{{ item.year }}</td>
                <td>{{ item.rate.toFixed(2) }}</td>
                <td> <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#exampleModal" data-bs-title="edit" @click='editModal(item)'>
                        Edit
                    </button>

                    <button type="button" class="btn btn-danger" @click="openModal(item)" data-bs-title="delete"
                        data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>