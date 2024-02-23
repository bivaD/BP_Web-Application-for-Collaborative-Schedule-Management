<!--
 - @file DataUnitsTable.vue
 - @description In this file is component for displaying table with units.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div class="table-responsive">
        <FormAlerts ref="alerts"/>
        <table class="table table-striped table-sm text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Předmět</th>
                    <th>Typ jednotky</th>                    
                    <th>Povinná</th>
                    <th>Typ výuky</th>
                    <th>Délka</th>
                    <th>Počet studentů</th>
                    <th>Přiřazená místnost</th>
                    <th>Detaily</th>
                    <th>Upravit</th>
                    <th>Smazat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="unit in units" :key="unit.id">
                    <td>{{ unit.id }}</td>
                    <td>{{ unit.subject.abbreviation }}</td>
                    <td>{{ UnitType[unit.type] }}</td>
                    <td>{{ unit.compulsory ? "Ano" : "Ne" }}</td>
                    <td>{{ unit.periodic ? "Periodická" : "Bloková" }}</td>
                    <td>{{ unit.duration + " minut" }}</td>
                    <td>{{ unit.requiredCapacity }}</td>
                    <td>{{ unit.room.name != "unsorted" ? unit.room.name : "nezařazeno" }}</td>
                    <td>
                        <button type="button" 
                        class="btn btn-info bi-info-square"
                        @click="$router.push(`/data/units/${unit.id}`)">
                        </button>
                    </td>
                    <td>
                        <button type="button" 
                        class="btn btn-success bi-pencil-square"
                        @click="$router.push(`/data/units/${unit.id}/edit`)">
                        </button>
                    </td>
                    <td>
                        <button @click="deleteUnit(unit)" class="btn btn-danger bi-trash">
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import FormAlerts from '../formComponents/FormAlerts.vue';
import { ref, toRefs, type ComponentPublicInstance } from 'vue';
import axios from 'axios';
import { UnitType, type IUnit } from '@/interfaces/dataTypesFE';

//data
interface Props {
    units: IUnit[],
}
const props = defineProps<Props>()
const { units } = toRefs(props);

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

//actions with data
function deleteUnit(unit: IUnit) {
    axios.delete('http://localhost:3000/units/' + unit.id)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
            units.value.splice(units.value.indexOf(unit), 1);
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}

</script>

 