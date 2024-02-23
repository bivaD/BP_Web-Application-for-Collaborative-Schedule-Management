<!--
 - @file DataSuitableRoomsTable.vue
 - @description In this file is component for displaying table with suitable rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div class="table-responsive">
        <FormAlerts ref="alerts"/>
        <table class="table table-striped table-sm text-nowrap">
            <thead>
                <tr>
                    <th>ID záznamu</th>
                    <th>Předmět</th>
                    <th>Typ Jednotky</th>
                    <th>Vhodná místnost</th>
                    <th>Smazat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="suitableRoom in suitableRooms" :key="suitableRoom.id">
                    <td>{{ suitableRoom.id }}</td>
                    <td>{{ suitableRoom.subject.abbreviation }}</td>
                    <td>{{ UnitType[suitableRoom.unitType] }}</td>
                    <td>{{ suitableRoom.room.name }}</td>
                    <td>
                        <button @click="deleteSuitableRoom(suitableRoom)" class="btn btn-danger bi-trash">
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { onMounted, ref, type ComponentPublicInstance } from 'vue';
import axios from 'axios';
import type { Ref } from 'vue';
import {  UnitType, type ISuitableRoom } from '@/interfaces/dataTypesFE';

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

//table data
var suitableRooms: Ref<ISuitableRoom[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/suitableRooms')
        .then(response => {
            suitableRooms.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
})

//actions with data
function deleteSuitableRoom(suitableRoom: ISuitableRoom) {
    axios.delete('http://localhost:3000/suitableRooms/' + suitableRoom.id)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
            suitableRooms.value.splice(suitableRooms.value.indexOf(suitableRoom), 1);
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}

</script>

 