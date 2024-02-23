<!--
 - @file DataRoomsTable.vue
 - @description In this file is component for displaying table with rooms.
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
                        <th>Název</th>
                        <th>Kapacita</th>
                        <th>Virtuální kapacita</th>
                        <th>Detaily</th>
                        <th>Upravit</th>
                        <th>Smazat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="room in rooms" :key="room.name">
                        <td>{{ room.name }}</td>
                        <td>{{ room.capacity }}</td>
                        <td>{{ Math.floor(room.capacity*settingsStore.getVirtualCapacityPercentage/100) }}</td>
                        <td>
                            <button type="button" 
                            class="btn btn-info bi-info-square"
                            @click="$router.push(`/data/rooms/${room.name}`)">
                            </button>
                        </td>
                        <td>
                            <button type="button" 
                            class="btn btn-success bi-pencil-square"
                            @click="$router.push(`/data/rooms/${room.name}/edit`)"
                            >
                            </button>
                        </td>
                        <td>
                            <button @click="deleteRoom(room)" class="btn btn-danger bi-trash">
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
import type { Ref } from 'vue';
import type { IRoom } from '@/interfaces/dataTypesFE';
import { useSettingsStore } from '@/stores/SettingsStore';

var settingsStore = useSettingsStore()

interface Props {
    rooms: IRoom[],
}
const props = defineProps<Props>()
const { rooms } = toRefs(props);

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()


//actions with data
function deleteRoom(room: IRoom) {
    axios.delete('http://localhost:3000/rooms/' + room.name)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
            rooms.value.splice(rooms.value.indexOf(room), 1);
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}
</script>

 