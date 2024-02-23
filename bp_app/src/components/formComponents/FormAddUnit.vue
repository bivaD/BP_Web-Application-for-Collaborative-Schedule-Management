<!--
 - @file FormAddUnit.vue
 - @description In this file is component with form for inserting units.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <label class="m-1 column-align">Předmět:</label>
        <select v-model="unit.subject" :class="(unit.subject.abbreviation == '' ? 'border-danger' : '')">
            <option disabled :value="{abbreviation: '', name: ''}">Vyber předmět</option>
            <option v-for="subject in subjects" :key="subject.abbreviation" :value="subject">
                {{ subject.abbreviation + " - " + subject.name }}
            </option>
        </select>
        <br />
        <label class="m-1 column-align">Typ lekce:</label>
        <select v-model="selectedUnitType" :class="(unit.subject.abbreviation == '' ? 'border-danger' : '')">
            <option disabled value="">Vyber typ lekce</option>
            <option v-for="unitType in availableTypes" :key="unitType" :value="unitType">
                {{ unitType }}
            </option>
        </select>

        <br />
        <label class="m-1">Je účast studentů na lekci povinná?</label>
        <input type="radio" id="ano" :value="true" v-model="unit.compulsory" />
        <label class="m-1 mx-2" for="ano">Ano</label>
        <input type="radio" id="ne" :value="false" v-model="unit.compulsory" />
        <label class="m-1" for="ne">Ne</label>

        <br />
        <label class="m-1 column-align">Počet studentů: </label>
        <NumberInput v-model:value="unit.requiredCapacity" v-model:valid="unitCapacityValid" :min="0" />
        <br />
        <label class="m-1 column-align">Délka lekce: </label>
        <TimeInput v-model:value="unit.duration" v-model:valid="unitTimeValid" :min-time="15"/>
        <br />

        <label class="m-1">Periodická/bloková lekce: </label>
        <input type="radio" id="periodic" :value="true" v-model="unit.periodic" />
        <label class="m-1 mx-2" for="periodic">Periodická</label>
        <input type="radio" id="block" :value="false" v-model="unit.periodic" />
        <label class="m-1" for="block">Bloková</label>

        <SelectWeeks v-if="unit.periodic" v-model:value="unit.weeks" v-model:valid="unitWeeksValid"/>
        <FormAddUnitSelectLecturers @selectedLecturersChange="(x) => unit.lecturers = x" :selected-lecturers="unit.lecturers"/>

        <button class="btn btn-dark mt-3" @click="clickedSubmit">Přidat lekci</button>


    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import { UnitType, WeekDaysType, type ILecturer, type ISubject, type IUnit } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import SelectWeeks from './SelectWeeks.vue';
import FormAddUnitSelectLecturers from './FormAddUnitSelectLecturers.vue';
import FormAlerts from './FormAlerts.vue';
import TimeInput from './TimeInput.vue';
import NumberInput from './NumberInput.vue';


var selectedUnitType: Ref<string> = ref('');

var subjects: Ref<ISubject[]> = ref([]);

var unit: Ref<IUnit> = ref({
    id: '', subject: { abbreviation: '', name: '' }, type: UnitType.Přednáška, requiredCapacity: 0, duration: 0, periodic: true, compulsory: true, frozen: true, weeks: [], day: WeekDaysType.unset, startTime: -1, room: { name: '', capacity: 42, reservedHours: [] }, lecturers: [] as ILecturer[]
});

var availableTypes: Ref<string[]> = ref(Object.keys(UnitType).filter((x) => isNaN(Number(x))));

onMounted(async () => {
    await axios
        .get('http://localhost:3000/subjects/table')
        .then(response => {
            
            subjects.value = response.data;
        })
})

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

var unitCapacityValid: Ref<boolean> = ref(true);
var unitTimeValid: Ref<boolean> = ref(false);
var unitWeeksValid: Ref<boolean> = ref(false);

function clickedSubmit() {
    if (unitWeeksValid.value && unitCapacityValid.value && unitTimeValid.value && selectedUnitType.value !== '' && unit.value.subject.abbreviation !== '') {
        axios.post('http://localhost:3000/units/', {
            subjectAbbreviation: unit.value.subject.abbreviation,
            type: availableTypes.value.indexOf(selectedUnitType.value),
            lecturers: unit.value.lecturers,
            requiredCapacity: unit.value.requiredCapacity,
            duration: unit.value.duration,
            frozen: false,
            periodic: unit.value.periodic,
            weeks: unit.value.periodic ? unit.value.weeks : [],
            day: WeekDaysType.unset,
            compulsory: unit.value.compulsory,
            startTime: -1,
            room: -1
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            alerts.value?.displaySuccessAlert(response.data);
        }).catch((error) => {
            if (error.response) {
                alerts.value?.displayFailureAlert(error.response.data);
            }
        });
    } else {
        alerts.value?.displayFailureAlert('Pro přidání lekce musí mít všechny kolonky validní hodnotu.');
    }
}
</script>

<style scoped>
.column-align {
    width: 8rem;
}
</style>