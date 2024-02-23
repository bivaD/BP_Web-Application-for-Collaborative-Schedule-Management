<!--
 - @file DetailRoom.vue
 - @description In this file is component for displaying detail of rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts"/>
        <h5>Kapacita:</h5>
        <p>{{ room.capacity }}</p>
        <h5>Virtuální kapacita:</h5>
        <p>{{ Math.floor(room.capacity*settingsStore.getVirtualCapacityPercentage/100)}}</p>
        <h5>Rezervace:</h5>
        <DataDisplayReservations :reservations="room.reservedHours"></DataDisplayReservations>
        <h5>Lekce v místnosti:</h5>
        <DataUnitsTable :units="units" />
        <button @click="$router.push(`/data/rooms/${roomName}/edit`)" class="btn btn-success bi-pencil-square">
            Upravit místnost
        </button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { onMounted, ref, toRefs, type ComponentPublicInstance } from 'vue';
import axios from 'axios';
import type { Ref } from 'vue';
import type { IRoom, IUnit } from '@/interfaces/dataTypesFE';
import DataDisplayReservations from '../dataComponents/DataDisplayReservations.vue';
import DataUnitsTable from '../dataComponents/DataUnitsTable.vue';
import { useSettingsStore } from '@/stores/SettingsStore';

var settingsStore = useSettingsStore();

//props
interface Props {
    roomName: string,
}
const props = defineProps<Props>()
const { roomName } = toRefs(props);

//fetch data
var room: Ref<IRoom> = ref({name: '', capacity: 42, reservedHours: []});
    onMounted(async () => {
    await axios
        .get('http://localhost:3000/rooms/' + roomName.value)
        .then(response => {
            
            room.value = response.data;
        })
})

var units: Ref<IUnit[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/units/byRoom/'+ roomName.value)
        .then(response => units.value = response.data)
        .catch(error => console.log(error))
})


</script>

 

