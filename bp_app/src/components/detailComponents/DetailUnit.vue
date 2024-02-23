<!--
 - @file DetailUnit.vue
 - @description In this file is component for displaying detail of units.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <h5>Předmět:</h5>
        <p>{{ unit.subject.abbreviation + ' - ' + unit.subject.name}}</p>
        <h5>Typ lekce:</h5>
        <p>{{ UnitType[unit.type] }}</p>
        <h5>Typ výuky:</h5>
        <p>{{ unit.periodic ? "Periodická" : "Bloková" }}</p>
        <h5>Povinná:</h5>
        <p>{{ unit.compulsory ? "Ano" : "Ne" }}</p>
        <h5>Délka lekce:</h5>
        <p>{{ unit.duration + " minut" }}</p>
        <h5>Počet studentů:</h5>
        <p>{{ unit.requiredCapacity }}</p>
        <h5>Přiřazená místnost:</h5>
        <p>{{ unit.room.name != "unsorted" ? unit.room.name : "nezařazeno" }}</p>
        <h5>Počet studentů:</h5>
        <p>{{ unit.requiredCapacity }}</p>
        <h5>Přednášející:</h5>
        <p>{{ displayLecturers() }}</p>
        <button @click="$router.push(`/data/units/${unitId}/edit`)" class="btn btn-success bi-pencil-square">
            Upravit lekci
        </button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';
import axios from 'axios';
import type { Ref } from 'vue';
import { UnitType, WeekDaysType, type ILecturer, type IUnit } from '@/interfaces/dataTypesFE';

interface Props {
    unitId: string,
}
const props = defineProps<Props>()
const { unitId } = toRefs(props);

var unit: Ref<IUnit> = ref({
    id: 'failed to load',    
    subject: {abbreviation: '', name: ''},
    type: UnitType.Cvičení,
    requiredCapacity: 42,
    duration: 42,
    periodic: true,
    compulsory: true,
    frozen: true,
    weeks: [],
    day: WeekDaysType.Ne,
    startTime: 42,
    room: {name: '', capacity: 42, reservedHours: []},
    lecturers: [] as ILecturer[]
});
onMounted(async () => {
    await axios
        .get('http://localhost:3000/units/' + unitId.value)
        .then(response => {
            
            unit.value = response.data;
        })
})

function displayLecturers(): string {
    var first: boolean = true;
    var result: string = '';
    for (var lecturer of unit.value.lecturers) {
        if (first) {
            first = false;
        } else {
            result += ', ';
        }
        if(lecturer.titlesBefore != ''){
            result += lecturer.titlesBefore + ' ';
        }
        result += lecturer.name + ' ' + lecturer.surname;
        if(lecturer.titlesAfter != ''){
            result += ' ' + lecturer.titlesAfter;
        }
    }
    if(result == ''){
        result = 'žádný přednášející'
    }
    return result;
}
</script>

 

