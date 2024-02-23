<!--
 - @file RoomTableView.vue
 - @description In this file is view for displaying table for rooms.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <TopPanel  :selected="'data'"/>
        <div class="m-5">
            <DataMenu />
            <h3 class="mt-3">Seznam přednášejících</h3>
            <DataLecturersTable :lecturers="lecturers" />
            <button class="btn btn-dark m-1" @click="$router.push('/data/lecturers/add')">Přidat přednášejícího</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import DataMenu from '@/components/dataComponents/DataMenu.vue';
import type { ILecturer } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';
import DataLecturersTable from '@/components/dataComponents/DataLecturersTable.vue';

//fetch data
var lecturers: Ref<ILecturer[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/lecturers/')
        .then(response => {
            
            lecturers.value = response.data;
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
            }
        })
})

</script>

 