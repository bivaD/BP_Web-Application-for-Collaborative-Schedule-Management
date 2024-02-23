<!--
 - @file DetailSubject.vue
 - @description In this file is component for displaying detail of subjects.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts"/>
        <h5>Celý název</h5>
        <p> {{ subject.name }}</p>
        <h5>Lekce patřící k předmětu</h5>
        <DataUnitsTable :units="units"/>
        <h5>Vyučující v předmětu</h5>
        <DataLecturersTable :lecturers="lecturers"/>

        <button @click="$router.push(`/data/subjects/${abbreviation}/edit`)" class="btn btn-success bi-pencil-square">
            Upravit předmět
        </button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { onMounted, ref, toRefs, type ComponentPublicInstance } from 'vue';
import axios from 'axios';
import type { Ref } from 'vue';
import type { ILecturer, ISubject, IUnit } from '@/interfaces/dataTypesFE';
import DataLecturersTable from '../dataComponents/DataLecturersTable.vue';
import DataUnitsTable from '../dataComponents/DataUnitsTable.vue';

//data
interface Props {
    abbreviation: string,
}
const props = defineProps<Props>()
const { abbreviation } = toRefs(props);

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

//fetch data
var subject: Ref<ISubject> = ref({ abbreviation: 'Neodařilo se načíst', name: 'Neodařilo se načíst' });
onMounted(async () => {
    await axios
        .get('http://localhost:3000/subjects/'+ abbreviation.value)
        .then(response => {
            subject.value = response.data;
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
})
var units: Ref<IUnit[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/units/bySubject/'+ abbreviation.value)
        .then(response => {
            units.value = response.data;
        })        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })})

var lecturers: Ref<ILecturer[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/lecturers/bySubject/'+ abbreviation.value)
        .then(response => {
            lecturers.value = response.data;
        })
})
</script>

 