<!--
 - @file SharedStudentsTableView.vue
 - @description In this file is view for displaying shared students in table.
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
            <h3 class="mt-3">Tabulka společných studentů lekcí</h3>
            <DataStudentsTable :units="units"/>
            <button class="btn btn-dark m-1" @click="$router.push('/data/sharedStudents/add')">Přidat sdílené studenty</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import DataMenu from '@/components/dataComponents/DataMenu.vue';
import type { ISharedStudentsRowAPI } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';
import DataStudentsTable from '@/components/dataComponents/DataStudentsTable.vue'; 


var units: Ref<ISharedStudentsRowAPI[]> = ref([]);
onMounted(async () => {
  await axios
    .get('http://localhost:3000/units/studentsTable')
    .then(response => {
        
        units.value = response.data;
    })
})

</script>

 