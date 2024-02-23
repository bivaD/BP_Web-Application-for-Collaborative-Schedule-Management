<!--
 - @file DataSubjectsTable.vue
 - @description In this file is component for displaying table with subjects.
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
                        <th>Zkratka</th>
                        <th>Název</th>
                        <th>Počet jednotek souvisejících s předmětem</th>
                        <th>Detaily</th>
                        <th>Upravit</th>
                        <th>Smazat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="subject in subjects" :key="subject.abbreviation">
                        <td>{{ subject.abbreviation }}</td>
                        <td>{{ subject.name }}</td>
                        <td>{{ subject.unitCount }}</td>
                        <td>
                            <button type="button" 
                            class="btn btn-info bi-info-square"
                            @click="$router.push(`/data/subjects/${subject.abbreviation}`)">
                            </button>
                        </td>
                        <td>
                            <button type="button" 
                            class="btn btn-success bi-pencil-square"
                            @click="$router.push(`/data/subjects/${subject.abbreviation}/edit`)">
                            </button>
                        </td>
                        <td>
                            <button @click="deleteSubject(subject)" 
                            class="btn btn-danger bi-trash">
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
import type { ISubjectsRowAPI } from '@/interfaces/dataTypesFE';

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

//data
interface Props {
    subjects: ISubjectsRowAPI[],
}
const props = defineProps<Props>()
const { subjects } = toRefs(props);

//delete subject
function deleteSubject(subject: ISubjectsRowAPI) {
    axios.delete('http://localhost:3000/subjects/' + subject.abbreviation)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
            subjects.value.splice(subjects.value.indexOf(subject), 1);
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}
</script>

 