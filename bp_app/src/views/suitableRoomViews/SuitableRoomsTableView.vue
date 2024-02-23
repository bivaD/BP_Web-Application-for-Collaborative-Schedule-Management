<!--
 - @file SuitableRoomTableView.vue
 - @description In this file is view for displaying suitable rooms in table.
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
            <h3 class="mt-3">Seznam vhodných místností pro předměty</h3>
            <DataSuitableRoomsTable :suitableRooms="suitableRooms"/>
            <button class="btn btn-dark m-1" @click="$router.push('/data/suitableRooms/add')">Přidat vhodnou místnost</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import DataMenu from '@/components/dataComponents/DataMenu.vue';
import type { ISuitableRoom } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';
import DataSuitableRoomsTable from '@/components/dataComponents/DataSuitableRoomsTable.vue';

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

</script>