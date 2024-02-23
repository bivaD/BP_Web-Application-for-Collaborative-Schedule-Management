<!--
 - @file DataStudentsTable.vue
 - @description In this file is component for displaying table with shared students.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div class="table-responsive">
        <table class="table table-striped table-sm text-nowrap">
            <thead class="thead-light">
            <tr>
                <th></th>
                <th>ID</th>
                <th v-for="unit in units" :key="unit.unitId"> {{ unit.unitId.substring(0, 5) + '...' }} </th>
            </tr>
            <tr>
                <th>ID</th>
                <th>Jméno</th>
                <th v-for="unit in units" :key="unit.unitId"> {{ unit.unitName }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="unit in units" :key="unit.unitId">
                <th>{{ unit.unitId.substring(0, 5) + '...' }}</th>
                <th>{{ unit.unitName }}</th>
                <td v-for="number in unit.count" :key="number"> {{ number }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { ISharedStudentsRowAPI } from '@/interfaces/dataTypesFE';

//data

interface Props {
    units: ISharedStudentsRowAPI[],
}
const props = defineProps<Props>()
const { units } = toRefs(props);

</script>

<style scoped>
    th, td{
        width: 50px !important;
    }
</style>