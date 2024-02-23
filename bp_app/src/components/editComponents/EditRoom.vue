<!--
 - @file EditRoom.vue
 - @description In this file is component for editing rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <label class="m-1">Kapacita místnosti:</label>
        <NumberInput v-model:value="room.capacity" v-model:valid="roomCapacityValid" :min="0" />
        <h3 class="mt-3">Rezervace:</h3>
        <FormAddRoomReservations @reservations-change="(newReservations) => { room.reservedHours = newReservations }"
            :current-reservations="room.reservedHours" />
        <button class="btn btn-success m-1" @click="clickedSubmit()">Upravit místnost</button>
        <button class="btn btn-danger m-1" @click="deleteLecturer()">Smazat místnost</button>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { onMounted, ref, toRefs, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios';
import FormAddRoomReservations from '../formComponents/FormAddRoomReservations.vue';
import type { IRoom } from '@/interfaces/dataTypesFE';
import NumberInput from '../formComponents/NumberInput.vue';

//getting data
interface Props {
    roomName: string,
}
const props = defineProps<Props>()
const { roomName } = toRefs(props);

var roomCapacityValid: Ref<boolean> = ref(true);

var room: Ref<IRoom> = ref({ name: '', capacity: 42, reservedHours: [] });
onMounted(async () => {
    await axios
        .get('http://localhost:3000/rooms/' + roomName.value)
        .then(response => {
            room.value = response.data;
        })
})

//updating data
const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

function clickedSubmit() {
    if (roomCapacityValid.value) {
        axios.put('http://localhost:3000/rooms/' + roomName.value, {
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
        alerts.value?.displayFailureAlert('Pro upravení místnosti musí mít všechny kolonky validní hodnotu.');
    }
};

//delete data
function deleteLecturer() {
    axios.delete('http://localhost:3000/rooms/' + roomName.value)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
        })
        .catch((error) => {
            if (error.response) {
                alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}
</script>

<style scoped>
.column-align {
    width: 10rem;
}
</style>