<!--
 - @file SubjectTableView.vue
 - @description In this file is view for displaying subjects in table.
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
            <h3 class="mt-3">Seznam předmětů</h3>
            <DataSubjectsTable :subjects="subjects"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import DataMenu from '@/components/dataComponents/DataMenu.vue';
import type { ISubjectsRowAPI } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';
import DataSubjectsTable from '@/components/dataComponents/DataSubjectsTable.vue';


var subjects: Ref<ISubjectsRowAPI[]> = ref([]);
    onMounted(async () => {
    await axios
        .get('http://localhost:3000/subjects/table')
        .then(response => {
            
            subjects.value = response.data;
        }).catch((error) => {
            console.log(error);
        })
})

</script>