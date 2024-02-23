<!--
 - @file DetailLecturer.vue
 - @description In this file is component for displaying detail of lecturer.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <h3 class="mb-3">{{ lecturer.titlesAfter }} {{ lecturer.name }} {{ lecturer.surname }} {{ lecturer.titlesAfter }}</h3>

        <h5>Identifikátor:</h5>
        <p>{{ lecturerId }}</p>
        <h5>Časové preference:</h5>
        <DataDisplayPriorities :priorities="lecturer.timePriorities" />
        <h5>Vyučované lekce:</h5>
        <DataUnitsTable :units="units" />
        <button @click="$router.push(`/data/lecturers/${lecturerId}/edit`)" class="btn btn-success bi-pencil-square">
            Upravit přednášejícího
        </button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { onMounted, ref, toRefs, type ComponentPublicInstance } from 'vue';
import axios from 'axios';
import type { Ref } from 'vue';
import type { ILecturer, IUnit } from '@/interfaces/dataTypesFE';
import DataDisplayPriorities from '../dataComponents/DataDisplayPriorities.vue';
import DataUnitsTable from '../dataComponents/DataUnitsTable.vue';

interface Props {
    lecturerId: string,
}
const props = defineProps<Props>()
const { lecturerId } = toRefs(props);

var lecturer: Ref<ILecturer> = ref({ id: '', name: '', surname: '', titlesBefore: '', titlesAfter: '', timePriorities: [] });
onMounted(async () => {
    await axios
        .get('http://localhost:3000/lecturers/' + lecturerId.value)
        .then(response => {
            
            lecturer.value = response.data;
        })
})

var units: Ref<IUnit[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/units/byLecturer/'+ lecturerId.value)
        .then(response => units.value = response.data)
        .catch(error => console.log(error))
})

</script>

 

