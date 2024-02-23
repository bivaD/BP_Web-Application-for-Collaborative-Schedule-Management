<!--
 - @file FormAddSuitableRoom.vue
 - @description In this file is component with form for inserting suitable rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts"/>
        <label class="m-1 column-align">Předmět:</label>
        <select v-model="selectedSubjectAbbreviation">
            <option disabled value="">Vyber předmět</option>
            <option v-for="subject in availableSubjects" :key="subject.abbreviation" :value="subject.abbreviation">
                {{ subject.abbreviation + " - " + subject.name }}
            </option>
        </select>
        <br />
        <label class="m-1 column-align">Typ lekce:</label>
        <select v-model="selectedUnitType">
            <option disabled value="">Vyber typ lekce</option>
            <option v-for="unitType in availableTypes" :key="unitType" :value="unitType">
                {{ unitType }}
            </option>
        </select>
        <br />
        <label class="m-1">Místnost, pro kterou tento typ lekce v tomto předmětu vyhovuje:</label>
        <select v-model="selectedRoomName">
            <option disabled value="">Vyber místnost:</option>
            <option v-for="room in availableRooms" :key="room.name" :value="room.name">
                {{ room.name }}
            </option>
        </select>
        <br />
        <button class="btn btn-dark my-3" @click="clickedSubmit">Přidat vhodnou místnost</button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from './FormAlerts.vue';
import { onMounted, ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import { UnitType, type IRoom, type ISubject } from '@/interfaces/dataTypesFE';

var selectedUnitType: Ref<string> = ref('');
var selectedSubjectAbbreviation: Ref<string> = ref('');
var selectedRoomName: Ref<string> = ref('');

var availableSubjects: Ref<ISubject[]> = ref([]);
var availableRooms: Ref<IRoom[]> = ref([]);

var availableTypes: Ref<string[]> = ref(Object.keys(UnitType).filter((x) => isNaN(Number(x))));

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()


onMounted(async () => {
    await axios
        .get('http://localhost:3000/subjects/table')
        .then(response => {
            
            availableSubjects.value = response.data;
        })
        .catch((error) => { console.log(error); });

    await axios
        .get('http://localhost:3000/rooms/table')
        .then(response => {
            
            availableRooms.value = response.data;
        })
        .catch((error) => { console.log(error); });
})
function clickedSubmit() {
    if(selectedRoomName.value !== '' && selectedUnitType.value !== '' && selectedSubjectAbbreviation.value !== ''){
    axios.post('http://localhost:3000/suitableRooms/', {
        subject: selectedSubjectAbbreviation.value,
        unitType: availableTypes.value.indexOf(selectedUnitType.value),
        room: selectedRoomName.value,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        alerts.value?.displaySuccessAlert(response.data);
    }).catch((error) => {
        if (error.response) {
        alerts.value?.displayFailureAlert(error.response.data);
        }
    })
} else {
    alerts.value?.displayFailureAlert('Všechny kolonky musí mít vybranou hodnotu.');
}

};
</script>
<style scoped>
.column-align {
    width: 5rem;
}
</style>