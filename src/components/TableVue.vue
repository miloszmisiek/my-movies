<script setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import Modal from "./ModalVue.vue";
import AddMovieForm from "./AddMovieForm.vue";
import EditMovieForm from "./EditMovieForm.vue";
import StarRating from "vue-star-rating";

const props = defineProps(["forceRender", "extMovies", "setAlertData"]);
const hasLoaded = ref(false);
const movies = ref([]);

const fetchMovies = async () => {
  try {
    const { data } = await axios.get("https://mymovies-task.azurewebsites.net");
    movies.value = data;
    hasLoaded.value = true;
  } catch (err) {
    console.log(err.response?.data);
    hasLoaded.value = true;
  }
};

const downloadMovies = async () => {
  hasLoaded.value = false;
  try {
    const { data } = await axios.get(
      "https://mymovies-task.azurewebsites.net/download"
    );
    const results = data.filter(
      (o1) =>
        !JSON.parse(JSON.stringify(movies.value)).some(
          (o2) => o1.title === o2.title && o1.director === o2.director
        )
    );
    results.forEach(
      async (obj) =>
        await axios.post("https://mymovies-task.azurewebsites.net/", obj)
    );
    hasLoaded.value = true;

    if (results.length) {
      movies.value = [...movies.value, ...results];
      props.setAlertData("success", "d-block", "Movies list updated!", true);
    } else {
      props.setAlertData("warning", "d-block", "No new movies!", true);
    }
  } catch (err) {
    console.log(err.response?.data);
    hasLoaded.value = true;
  }
  props.forceRender();
};

const deleteMovie = async (id) => {
  await axios.delete(`https://mymovies-task.azurewebsites.net/${id}`);
  reRender();
};
onMounted(() => {
  setTimeout(() => {
    fetchMovies();
  }, 1000);
});

const modalVar = reactive({
  modalData: null,
  editData: null,
  editMode: false,
  deleteMode: false,
});

const openModal = (data) => {
  modalVar.editMode = false;
  modalVar.deleteMode = true;
  modalVar.modalData = data;
};

const editModal = (data) => {
  modalVar.deleteMode = false;
  modalVar.editMode = true;
  modalVar.editData = data;
};

const addMovie = () => {
  modalVar.deleteMode = false;
  modalVar.editMode = false;
};

const reRender = (mode) => {
  document.getElementById("close-btn").click();
  props.forceRender();
  mode === "add"
    ? props.setAlertData(
      "success",
      "block",
      "Your movie has been added to the list!",
      true
    )
    : mode === "edit" ?
      props.setAlertData(
        "success",
        "block",
        "Your movie has been edited.",
        true
      )
      : props.setAlertData(
        "secondary",
        "block",
        "Your movie has been deleted",
        true
      )
};
</script>

<template>
  <Modal :data="modalVar.modalData" :editMode="modalVar.editMode" :deleteMode="modalVar.deleteMode"
    :deleteMovie="deleteMovie" v-model:formSubmit="modalVar.formSubmit">
    <template v-slot:header>
      <h2 v-if="modalVar.editMode" class="modal-title fs-5" id="mainModalLabel">
        Edit movie
      </h2>
      <h2 v-else-if="modalVar.deleteMode" class="modal-title fs-5" id="mainModalLabel">
        Delete movie
      </h2>
      <h2 v-else class="modal-title fs-5" id="mainModalLabel">Add movie</h2>
    </template>
    <template v-slot:body>
      <EditMovieForm :key="modalVar.editData?.id" v-if="modalVar.editMode" :data="modalVar.editData"
        @formSubmitted="reRender('edit')" :setAlertData="props.setAlertData" />
      <p class="delete__msg" v-else-if="modalVar.deleteMode">
        Are you sure you want to delete movie: <br />
        {{ modalVar.modalData.title.toUpperCase() }}?
      </p>
      <AddMovieForm v-else @formSubmitted="reRender('add')" :setAlertData="props.setAlertData" />
    </template>
  </Modal>
  <div v-if="hasLoaded" class="table-responsive">
    <div class="table__buttons--top">
      <!-- Download Movie Button -->
      <button type="button" @click="downloadMovies" class="btn py-3">
        <font-awesome-icon icon="cloud-download" size="2xl" class="download__icon text-primary" bounce />
      </button>
      <!-- Add Movie Button -->
      <button type="button" @click="addMovie" class="btn" data-bs-toggle="modal" data-bs-target="#mainModal">
        <font-awesome-icon icon="plus" size="sm" class="add__movie--icon" inverse beat />
      </button>
    </div>
    <!-- Table -->
    <table class="table table-striped text-center align-middle">
      <!-- Table Head -->
      <thead class="table-dark">
        <tr>
          <th v-for="(value, key, idx) of movies[0]" :key="idx" scope="col">
            {{
                key === "id" ? "#" : key.charAt(0).toUpperCase() + key.slice(1)
            }}
          </th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <!-- Table Body -->
      <tbody>
        <tr v-for="(item, idx) of movies" :key="item.id">
          <!-- Id -->
          <td data-label="#">{{ idx + 1 }}</td>
          <!-- Title -->
          <td data-label="Title">{{ item.title }}</td>
          <!-- Director -->
          <td data-label="Director">{{ item.director }}</td>
          <!-- Year -->
          <td data-label="Year">{{ item.year }}</td>
          <!-- Rate -->
          <td data-label="Rate">
            <star-rating :read-only="true" :increment="0.5" :max-rating="1" inactive-color="#e4c000" :star-size="20"
              :show-rating="false" :inline="true" />
            <span class="rate__num">
              {{ item.rate === 10 ? item.rate : item.rate.toFixed(1) }}
              <span class="rate__limit">/ 10</span></span>
          </td>
          <!-- Action Buttons -->
          <td data-label="Action" class="justify-content-around">
            <!-- Edit Button -->
            <button type="button" class="btn text-secondary" data-bs-toggle="modal" data-bs-target="#mainModal"
              data-bs-title="edit" @click="editModal(item)">
              <font-awesome-icon icon="edit" size="lg" shake />
            </button>
            <!-- Delete Button -->
            <button type="button" class="btn text-danger" @click="openModal(item)" data-bs-title="delete"
              data-bs-toggle="modal" data-bs-target="#mainModal">
              <font-awesome-icon icon="trash" size="lg" shake />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Spinner Icon -->
  <div v-else class="spinner">
    <font-awesome-icon icon="fa-solid fa-spinner" spin-pulse size="6x" />
  </div>
</template>
