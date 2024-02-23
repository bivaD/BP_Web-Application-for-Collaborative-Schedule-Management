<!--
 - @file UnitTableView.vue
 - @description In this file is view for displaying units in table.
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
            <h3 class="mt-3">Seznam lekcí</h3>
            <DataUnitsTable :units="units"/>
            <button class="btn btn-dark m-1" @click="$router.push('/data/units/add')">Přidat lekci</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import DataMenu from '@/components/dataComponents/DataMenu.vue';
import type { IUnit } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue';
import DataUnitsTable from '@/components/dataComponents/DataUnitsTable.vue';


//fetch data
var units: Ref<IUnit[]> = ref([]);
onMounted(async () => {
    await axios
        .get('http://localhost:3000/units')
        .then(response => units.value = response.data)
        .catch(error => console.log(error))
})

</script>

 