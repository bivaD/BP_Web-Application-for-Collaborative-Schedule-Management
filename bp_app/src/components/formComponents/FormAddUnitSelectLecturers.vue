<!--
 - @file FormAddUnitSelectLecturers.vue
 - @description In this file is component with form for adding lecturers to unit..
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <h5 class="mt-3">Přednášející v této lekci: </h5>
        <div v-for="lecturer in selectedLecturers" :key="lecturer.id">
            <label class="lecturer-column m-1">{{ showLecturer(lecturer) }}</label>
            <button class="btn btn-danger m-1" @click="unselectLecturer(lecturer)">Odstranit</button>
        </div>
        <div class="input-group">
            <select class="custom-select" v-model="selectedLecturer">
                <option disabled :value="defaultValue">Vyber přednášejícího:</option>
                <option v-for="lecturer in availableLecturers" :key="lecturer.id" :value="lecturer">
                    {{ showLecturer(lecturer) }}
                </option>
            </select>
            <button class="btn btn-secondary" @click="selectLecturer">Přidat přednášejícího</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import type { ILecturer } from '@/interfaces/dataTypesFE';

//properties
interface Props {
    selectedLecturers: ILecturer[],
}
const props = defineProps<Props>()
const { selectedLecturers } = toRefs(props);


const defaultValue: ILecturer = {
    id: '',
    name: '',
    surname: 'Žádný dostupný přednášející',
    titlesBefore: '',
    titlesAfter: '',
    timePriorities: []
}
var availableLecturers: Ref<ILecturer[]> = ref([]);
var selectedLecturer: Ref<ILecturer> = ref(defaultValue);

const emit = defineEmits<{
    (e: 'selectedLecturersChange', selectedLecturers: ILecturer[]): void
}>()

function selectLecturer() {
    if (JSON.stringify(selectedLecturer.value) == JSON.stringify(defaultValue)) {
        return;
    }
    selectedLecturers.value.push(selectedLecturer.value);
    const index = availableLecturers.value.indexOf(selectedLecturer.value);
    availableLecturers.value.splice(index, 1);
    if (availableLecturers.value.length) {
        selectedLecturer.value = defaultValue;
    } else {
        selectedLecturer.value = defaultValue;
    }
    emit('selectedLecturersChange', selectedLecturers.value);
}
function unselectLecturer(lecturer: ILecturer) {
    const index = selectedLecturers.value.indexOf(lecturer);
    availableLecturers.value.push(selectedLecturers.value[index]);
    selectedLecturers.value.splice(index, 1);
    selectedLecturer.value = selectedLecturers.value[0];
    emit('selectedLecturersChange', selectedLecturers.value);
}

function showLecturer(lecturer: ILecturer) {
    return lecturer.titlesBefore + " " + lecturer.name + " " + lecturer.surname + " " + lecturer.titlesAfter;
}

onMounted(async () => {
    await axios
        .get('http://localhost:3000/lecturers')
        .then(response => {
            
            availableLecturers.value = response.data;
            if (availableLecturers.value.length < 1) {
                selectedLecturer.value = availableLecturers.value[0];
            }
        })
});
</script>

<style scoped>
.lecturer-column{
    width: 20rem;
}
</style>