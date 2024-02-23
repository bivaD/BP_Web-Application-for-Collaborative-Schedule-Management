<!--
 - @file RoomTableView.vue
 - @description In this file is view for displaying rooms in table.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <TopPanel  :selected="'data'"/>
        <div class="m-5">
            <DataMenu/>            
            <h3 class="mt-3">Seznam místností</h3>
            <DataRoomsTableVue :rooms="rooms"/>
            <button class="btn btn-dark m-1" @click="$router.push('/data/rooms/add')">Přidat místnost</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import DataMenu from '@/components/dataComponents/DataMenu.vue';
import type { IRoom } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';
import DataRoomsTableVue from '@/components/dataComponents/DataRoomsTable.vue';


//fetch data
var rooms: Ref<IRoom[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/rooms/table')
        .then(response => {
            
            rooms.value = response.data;
        })
        .catch((error) => {
            console.log(error);
        });
})

</script>

 