<!--
 - @file FormAddRoom.vue
 - @description In this file is component with form for inserting rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div class="mt-3">
        <FormAlerts ref="alerts" />
        <div>
            <label class="m-1">Název místnosti:</label>
            <AlphaNumericInput v-model:value="room.name" v-model:valid="roomNameValid"/>
            <br />
            <label class="m-1">Kapacita místnosti:</label>
            <NumberInput v-model:value="room.capacity" v-model:valid="roomCapacityValid" :min="0" />
            <FormAddRoomReservations @reservations-change="(newReservations) => { room.reservedHours = newReservations }"
                :current-reservations="settingsStore.getDefaultReservations" />
            <button class="btn btn-dark" @click="clickedSubmit()">Přidat místnost</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from './FormAlerts.vue';
import { ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import { useSettingsStore } from '@/stores/SettingsStore';
import FormAddRoomReservations from './FormAddRoomReservations.vue';
import NumberInput from './NumberInput.vue';
import AlphaNumericInput from './AlphaNumericInput.vue';
import type { IRoom } from '@/interfaces/dataTypesFE';

var settingsStore = useSettingsStore()

var roomNameValid: Ref<boolean> = ref(false);
var roomCapacityValid: Ref<boolean> = ref(true);

var room: Ref<IRoom> = ref({ name: '', capacity: 42, reservedHours: settingsStore.getDefaultReservations });

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()


function clickedSubmit() {
    if (roomNameValid.value && roomCapacityValid.value) {
        axios.post('http://localhost:3000/rooms/', {
            name: room.value.name,
            capacity: room.value.capacity,
            reservedHours: room.value.reservedHours
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
        alerts.value?.displayFailureAlert('Pro přidání místnosti musí mít všechny kolonky validní hodnotu.');
    }
}
</script>

 