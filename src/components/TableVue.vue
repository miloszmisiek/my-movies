<script setup>
import { onMounted, reactive, ref } from "vue";
import Modal from "./ModalVue.vue";
import AddMovieForm from "./AddMovieForm.vue";
import EditMovieForm from "./EditMovieForm.vue";
import StarRating from "vue-star-rating";
import { axiosReq, axiosRes } from "../api/axiosDefaults";

const tableHeadings = ["id", "title", "director", "year", "rate", "action"];
const props = defineProps(["forceRender", "extMovies", "setAlertData"]);
const hasLoaded = ref(false);
const movies = ref([]);
const errors = ref({});
const ascending = ref(true);
const sortColumn = ref("");
const addMovieForm = ref(null);
const editMovieForm = ref(null);

const fetchMovies = async () => {
  try {
    const { data } = await axiosReq.get();
    movies.value = data?.sort((a, b) => a.id - b.id);
    movies.value?.map((m, idx) => (m["idx"] = idx));
    if (movies.value.length) {
      sortColumn.value = Object.keys(movies.value[0])[0];
    }
    hasLoaded.value = true;
  } catch (err) {
    errors.value = err;
    console.log(err);
    hasLoaded.value = true;
  }
};

const downloadMovies = async () => {
  hasLoaded.value = false;
  try {
    const { data } = await axiosReq.get("/download");
    const results = data.filter(
      (o1) =>
        !JSON.parse(JSON.stringify(movies.value)).some(
          (o2) => o1.title === o2.title && o1.director === o2.director
        )
    );
    results.forEach(async (obj) => await axiosRes.post("", obj));
    hasLoaded.value = true;

    if (results.length) {
      movies.value = [...movies.value, ...results];
      props.setAlertData("success", "Movies list updated!", true);
    } else {
      props.setAlertData("warning", "No new movies!", true);
    }
  } catch (err) {
    hasLoaded.value = true;
    props.setAlertData("danger", `${err.message}`, true);
  }
  props.forceRender();
};

const deleteMovie = async (id) => {
  try {
    await axiosRes.delete(`${id}`);
    reRender();
  } catch (err) {
    document.getElementById("close-btn").click();
    props.setAlertData("danger", `${err.message}`, true);
  }
};

onMounted(() => {
  errors.value = {};
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
  editMovieForm.value?.resetForm();
};

const addMovie = () => {
  modalVar.deleteMode = false;
  modalVar.editMode = false;
  addMovieForm.value?.resetForm();
};

const reRender = (mode) => {
  document.getElementById("close-btn").click();
  props.forceRender();
  mode === "add"
    ? props.setAlertData(
        "success",
        "Your movie has been added to the list!",
        true
      )
    : mode === "edit"
    ? props.setAlertData("success", "Your movie has been edited.", true)
    : props.setAlertData("secondary", "Your movie has been deleted", true);
};

const sortTable = (col) => {
  if (sortColumn.value === col) {
    ascending.value = !ascending.value;
  } else {
    ascending.value = true;
    sortColumn.value = col;
  }
  movies.value.sort((a, b) => {
    if (a[col] > b[col]) {
      return ascending.value ? 1 : -1;
    } else if (a[col] < b[col]) {
      return ascending.value ? -1 : 1;
    }
    return 0;
  });
};
</script>

<template>
  <!-- Modal -->
  <Modal
    :data="modalVar.modalData"
    :editMode="modalVar.editMode"
    :deleteMode="modalVar.deleteMode"
    :deleteMovie="deleteMovie"
    v-model:formSubmit="modalVar.formSubmit"
  >
    <template v-slot:header>
      <!-- Edit Movie Heading -->
      <h2 v-if="modalVar.editMode" class="modal-title fs-5" id="mainModalLabel">
        Edit movie
      </h2>
      <!-- Delete Movie Heading -->
      <h2
        v-else-if="modalVar.deleteMode"
        class="modal-title fs-5"
        id="mainModalLabel"
      >
        Delete movie
      </h2>
      <!-- Add Movie Heading -->
      <h2 v-else class="modal-title fs-5" id="mainModalLabel">Add movie</h2>
    </template>
    <template v-slot:body>
      <!-- Edit Movie Form -->
      <EditMovieForm
        ref="editMovieForm"
        :key="modalVar.editData?.id"
        v-if="modalVar.editMode"
        :data="modalVar.editData"
        @formSubmitted="reRender('edit')"
        :setAlertData="props.setAlertData"
      />
      <!-- Delete Form Message -->
      <p class="delete__msg" v-else-if="modalVar.deleteMode">
        Confirm you want to delete the movie: <br /><br />
        <span>{{ modalVar.modalData.title.toUpperCase() }}</span>
      </p>
      <!-- Add Movie Form -->
      <AddMovieForm
        ref="addMovieForm"
        v-else
        @formSubmitted="reRender('add')"
        :setAlertData="props.setAlertData"
      />
    </template>
  </Modal>
  <!-- Movies Fetched Section -->
  <div v-if="hasLoaded" class="table-responsive">
    <!-- Movies Action Buttons -->
    <div class="table__buttons--top">
      <!-- Download Movie Button -->
      <button type="button" @click="downloadMovies" class="btn py-3">
        <font-awesome-icon
          icon="cloud-download"
          size="3x"
          class="download__icon text-primary"
          bounce
        />
      </button>
      <!-- Add Movie Button -->
      <button
        type="button"
        @click="addMovie"
        class="btn"
        data-bs-toggle="modal"
        data-bs-target="#mainModal"
      >
        <font-awesome-icon
          icon="plus"
          size="2xl"
          class="add__movie--icon"
          inverse
          beat
        />
      </button>
    </div>
    <!-- Table -->
    <table
      class="table table-dark table-striped text-center align-middle"
      id="main-table"
    >
      <!-- Table Head -->
      <thead>
        <!-- Fetch Headings -->
        <tr v-if="!!movies.length">
          <th
            scope="col"
            v-for="col in Object.keys(movies[0]).filter((k) => k !== 'idx')"
            :key="col.id"
            @click="sortTable(col)"
          >
            {{ col }}
            <font-awesome-icon
              v-if="col === sortColumn"
              :icon="
                ascending
                  ? 'fas fa-chevron-circle-up'
                  : 'fas fa-chevron-circle-down'
              "
              size="xs"
            />
          </th>
          <th scope="col">Action</th>
        </tr>
        <!-- No Movies Headings -->
        <tr v-else>
          <th scope="col" v-for="h in tableHeadings" :key="h">
            {{ h }}
          </th>
        </tr>
      </thead>
      <!-- Table Body -->
      <tbody v-if="!!movies.length">
        <tr v-for="item of movies" :key="item.id">
          <!-- Id -->
          <td data-label="ID">{{ item.idx + 1 }}</td>
          <!-- Title -->
          <td data-label="Title">{{ item.title }}</td>
          <!-- Director -->
          <td data-label="Director">{{ item.director }}</td>
          <!-- Year -->
          <td data-label="Year">{{ item.year }}</td>
          <!-- Rate -->
          <td data-label="Rate">
            <star-rating
              :read-only="true"
              :increment="0.5"
              :max-rating="1"
              inactive-color="#e4c000"
              :star-size="20"
              :show-rating="false"
              :inline="true"
            />
            <span class="rate__num">
              {{ item.rate === 10 ? item.rate : item.rate.toFixed(1) }}
              <span class="rate__limit">/ 10</span></span
            >
          </td>
          <!-- Action Buttons -->
          <td data-label="Action" class="justify-content-around">
            <!-- Edit Button -->
            <button
              type="button"
              class="btn text-secondary"
              data-bs-toggle="modal"
              data-bs-target="#mainModal"
              data-bs-title="edit"
              @click="editModal(item)"
            >
              <font-awesome-icon icon="edit" size="lg" shake />
            </button>
            <!-- Delete Button -->
            <button
              type="button"
              class="btn text-danger"
              @click="openModal(item)"
              data-bs-title="delete"
              data-bs-toggle="modal"
              data-bs-target="#mainModal"
            >
              <font-awesome-icon icon="trash" size="lg" shake />
            </button>
          </td>
        </tr>
      </tbody>
      <!-- Nothing to Show Message -->
      <div v-else class="no__movies--text">Nothing to be shown... yet</div>
    </table>
  </div>
  <!-- Spinner Icon -->
  <div v-else class="spinner">
    <font-awesome-icon icon="fa-solid fa-spinner" spin-pulse size="6x" />
  </div>
</template>
