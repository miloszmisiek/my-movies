<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import Alert from './Alert.vue';

const props = defineProps(['data', 'editMode', 'deleteMode', 'modalHidden', 'deleteMovie', 'alertData'])
const router = useRouter();
const submitted = reactive({ submitted: false })

const alertData = reactive({
    alert: "warning",
    display: 'd-block',
    message: "Default message",
    alertVisible: false,
})

onMounted(() => {
    const myModalEl = document.getElementById('mainModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
        props.modalHidden();
    })
})


</script>
<template>
    <!-- Modal -->
    <div class="modal fade" id="mainModal" tabindex="-1" aria-labelledby="mainModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header" />
                    <button type="button" class="btn-close"
                        aria-label="Close" data-bs-dismiss="modal" id="close-btn"></button>
                </div>
                <div class="modal-body">
                    <slot name="body" />
                    <div v-if="props.deleteMode" class="modal-footer">
                        <button type="button" class="btn btn-secondary">Close</button>
                        <button @click="props.deleteMovie(props.data.id), $emit('update:formSubmit', true)"
                            class="btn btn-primary">Delete</button>
                    </div>
                    <Alert v-if="alertData.alertVisible" :data="alertData" />
                </div>
                <!-- <div class="modal-footer">
                        <button @click="submitted.submitted && router.go()" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                    </div> -->

            </div>
        </div>
    </div>
</template>