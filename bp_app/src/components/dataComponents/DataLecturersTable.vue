<!--
 - @file DataLecturersTable.vue
 - @description In this file is component for displaying table with lecturers.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts"/>
        <div class="table-responsive">
            <table class="table table-striped table-sm text-nowrap">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Jméno</th>

                        <th>Detaily</th>
                        <th>Upravit</th>
                        <th>Smazat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lecturer in lecturers" :key="lecturer.id">
                        <td>{{ lecturer.id }}</td>
                        <td>{{ lecturer.titlesBefore + " " + lecturer.name + " " + lecturer.surname + " " +
                            lecturer.titlesAfter }}</td>
                        <td>
                            <button type="button" 
                                class="btn btn-info bi-info-square"
                                @click="$router.push(`/data/lecturers/${lecturer.id}`)">
                            </button>
                        </td>
                        <td>
                            <button type="button" 
                            class="btn btn-success bi-pencil-square"
                            @click="$router.push(`/data/lecturers/${lecturer.id}/edit`)">
                            </button>
                        </td>
                        <td>
                            <button @click="deleteLecturer(lecturer)" class="btn btn-danger bi-trash">
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { ref, toRefs, type ComponentPublicInstance } from 'vue';
import axios from 'axios';
import type { ILecturer } from '@/interfaces/dataTypesFE';


interface Props {
    lecturers: ILecturer[],
}
const props = defineProps<Props>()
const { lecturers } = toRefs(props);

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

//actions with data
function deleteLecturer(lecturer: ILecturer) {
    axios.delete('http://localhost:3000/lecturers/' + lecturer.id)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
            lecturers.value.splice(lecturers.value.indexOf(lecturer), 1);
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}

</script>

 