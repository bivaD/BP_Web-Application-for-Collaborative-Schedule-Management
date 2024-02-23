<!--
 - @file EditUnit.vue
 - @description In this file is component for editing units.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <FormAlerts ref="alerts" />
        <label class="m-1 column-align">Předmět:</label>
        <select v-model="unit.subject.abbreviation" :class="(unit.subject.abbreviation == '' ? 'border-danger' : '')">
            <option disabled :value="''">Vyber předmět</option>
            <option v-for="subject in subjects" :key="subject.abbreviation" :value="subject.abbreviation">
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

        <button class="btn btn-success m-1" @click="clickedSubmit">Upravit lekci</button>
        <button class="btn btn-danger m-1" @click="deleteUnit(unit)">Smazat lekci</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import { UnitType, WeekDaysType, type ILecturer, type ISubject, type IUnit } from '@/interfaces/dataTypesFE';
import axios from 'axios';
import SelectWeeks from '../formComponents/SelectWeeks.vue';
import FormAddUnitSelectLecturers from '../formComponents/FormAddUnitSelectLecturers.vue';
import FormAlerts from '../formComponents/FormAlerts.vue';
import TimeInput from '../formComponents/TimeInput.vue';
import NumberInput from '../formComponents/NumberInput.vue';

var availableTypes: Ref<string[]> = ref(Object.keys(UnitType).filter((x) => isNaN(Number(x))));
var subjects: Ref<ISubject[]> = ref([]);
var unitDurationHours: Ref<number> = ref(0);
var unitDurationMinutes: Ref<number> = ref(0);
var selectedUnitType: Ref<string> = ref('');

onMounted(async () => {
    await axios
        .get('http://localhost:3000/subjects/table')
        .then(response => {
            subjects.value = response.data;
        })
})

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

var unitCapacityValid: Ref<boolean> = ref(true);
var unitTimeValid: Ref<boolean> = ref(true);
var unitWeeksValid: Ref<boolean> = ref(true);

//fetch data
interface Props {
    unitId: string,
}
const props = defineProps<Props>()
const { unitId } = toRefs(props);

var unit: Ref<IUnit> = ref({
    id: '', subject: { abbreviation: '', name: '' }, type: UnitType.Přednáška, requiredCapacity: 0, duration: 0, periodic: true, compulsory: true, frozen: true, weeks: [], day: WeekDaysType.unset, startTime: 42, room: { name: '', capacity: 42, reservedHours: [] }, lecturers: [] as ILecturer[]
});
onMounted(async () => {
    await axios
        .get('http://localhost:3000/units/' + unitId.value)
        .then(response => {
            unit.value = response.data;
            setFetchedValues();
        })
})
function setFetchedValues() {
    unitDurationHours.value = Math.floor(unit.value.startTime / 60);
    unitDurationMinutes.value = unit.value.startTime % 60;
    selectedUnitType.value = UnitType[unit.value.type];
    //workaround string[] to number[]
    var wks = unit.value.weeks as unknown[];
    var realWeeks: number[] = [];
    for(var x of wks){
        realWeeks.push(parseInt(x as string));
    }   
    unit.value.weeks = realWeeks;
}

//submit
function clickedSubmit() {
    if (unitWeeksValid.value && unitCapacityValid.value && unitTimeValid.value && selectedUnitType.value !== '' && unit.value.subject.abbreviation !== '') {
        axios.put('http://localhost:3000/units/' + unit.value.id, {
            subjectAbbreviation: unit.value.subject.abbreviation,
            type: availableTypes.value.indexOf(selectedUnitType.value),
            lecturers: unit.value.lecturers,
            requiredCapacity: unit.value.requiredCapacity,
            duration: unit.value.duration,
            frozen: false,
            periodic: unit.value.periodic,
            weeks: unit.value.periodic ? unit.value.weeks : [],
            compulsory: unit.value.compulsory,
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
        alerts.value?.displayFailureAlert('Pro upravení lekce musí mít všechny kolonky validní hodnotu.');
    }
}

//actions with data
function deleteUnit(unit: IUnit) {
    axios.delete('http://localhost:3000/units/' + unit.id)
        .then(response => {
            alerts.value?.displaySuccessAlert(response.data);
        })
        .catch((error) => {
            if (error.response) {
            alerts.value?.displayFailureAlert(error.response.data);
            }
        })
}
</script>

<style scoped>
.column-align {
    width: 8rem;
}
</style>