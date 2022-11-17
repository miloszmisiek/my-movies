<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps(['data', 'editMode', 'deleteMode', 'modalHidden'])
const router = useRouter();
const submitted = reactive({ submitted: false })
const deleteMovie = async () => {
    console.log(`deleted movie`)
}

onMounted(() => {
    const myModalEl = document.getElementById('exampleModal')
    myModalEl.addEventListener('hidden.bs.modal', event => {
        props.modalHidden();
    })
})


</script>
<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header" />
                    <button @click="submitted.submitted && router.go()" type="button" class="btn-close"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot name="body" />
                </div>
                <!-- <div class="modal-footer">
                        <button @click="submitted.submitted && router.go()" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                    </div> -->

            </div>
        </div>
    </div>
</template>