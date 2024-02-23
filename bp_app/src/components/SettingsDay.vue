<!--
 - @file SettingsDay.vue
 - @description In this file is component for settings. Subject to refactor.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="m-5">
        <FormAlerts ref="alerts" />

        <h1>Nastavení</h1>
        <h3 class="mt-3">Možnosti editoru:</h3>

        <label class="m-1 basic-settings-name">Počet týdnů v semestru: </label>
        <NumberInput v-model:value="weeksInSemester" v-model:valid="weeksInSemesterValid" :min="1" />
        <br />
        <label class="m-1 basic-settings-name">Den začíná v: </label>
        <NumberInput v-model:value="startHour" v-model:valid="startHourValid" :min="0" :max="23" />
        <br />
        <label class="m-1 basic-settings-name">Den končí v: </label>
        <NumberInput v-model:value="endHour" v-model:valid="endHourValid" :min="1" :max="24" />
        <br />
        <label class="m-1 basic-settings-name">Šířka rozvrhu v editoru: </label>
        <NumberInput v-model:value="timetableWidthInEditor" v-model:valid="timetableWidthInEditorValid" :min="500" />
        <label class="m-1">pixelů</label>
        <br />

        <h5 class="mt-3">Zobrazené dny:</h5>
        <div>
            <div>
                <label class="day-name">Pondělí: </label>
                <input type="checkbox" v-model="days[1]">
            </div>
            <div>
                <label class="day-name">Úterý: </label>
                <input type="checkbox" v-model="days[2]">
            </div>
            <div>
                <label class="day-name">Středa: </label>
                <input type="checkbox" v-model="days[3]">
            </div>
            <div>
                <label class="day-name">Čtvrtek: </label>
                <input type="checkbox" v-model="days[4]">
            </div>
            <div>
                <label class="day-name">Pátek: </label>
                <input type="checkbox" v-model="days[5]">
            </div>
            <div>
                <label class="day-name">Sobota: </label>
                <input type="checkbox" v-model="days[6]">
            </div>
            <div>
                <label class="day-name">Neděle: </label>
                <input type="checkbox" v-model="days[7]">
            </div>
        </div>

        <h3 class="mt-3">Výchozí preference vyučujících:</h3>
        <FormAddLecturerPriorities @priorities-change="(newPriorities) => { priorities = newPriorities }"
            :current-priorities="priorities" />

        <h3 class="mt-3">Výchozí rezervace v místnostech:</h3>
        <FormAddRoomReservations @reservations-change="(newReservations) => { reservations = newReservations }"
            :current-reservations="reservations" />

        <h3 class="mt-3">Parametry kolizí:</h3>
        <label class="m-1">Virtuální kapacita je </label>
        <NumberInput v-model:value="virtualCapacityPercentage" v-model:valid="virtualCapacityPercentageValid" :min="0" />
        <label class="m-1">% z reálné kapacity místnosti.</label>

        <br />
        <label class="m-1">Dvě lekce rozvrhnuté na stejný čas můžou mít maximálně </label>
        <NumberInput v-model:value="sharedStudentsTreshold" v-model:valid="sharedStudentsTresholdValid" :min="0" />
        <label class="m-1">% společných studentů.</label>

        <br />
        <label class="m-1">Učitel nemůže učit, pokud je jeho preference </label>
        <NumberInput v-model:value="preferencesTreshold" v-model:valid="preferencesTresholdValid" :min="0" :max="5" />
        <label class="m-1">nebo nižší.</label>
        <br />

        <button class="btn btn-dark my-3" @click="submit">Uložit nastavení</button>
    </div>
</template>

<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue'
import type { Ref } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore';
import type { WeekDaysType } from '@/interfaces/dataTypesFE';
import FormAddLecturerPriorities from './formComponents/FormAddLecturerPriorities.vue';
import FormAddRoomReservations from './formComponents/FormAddRoomReservations.vue';
import FormAlerts from './formComponents/FormAlerts.vue';
import NumberInput from './formComponents/NumberInput.vue';


var settingsStore = useSettingsStore();
settingsStore.synchronizeSettings();

var startHour: Ref<number> = ref(settingsStore.getStartHour);
var days: Ref<boolean[]> = ref(daysFromStore());
var endHour: Ref<number> = ref(settingsStore.getEndHour);
var weeksInSemester: Ref<number> = ref(settingsStore.getWeeksInSemester);
var priorities: Ref<number[]> = ref(settingsStore.getDefaultPriorities);
var reservations: Ref<string[]> = ref(settingsStore.getDefaultReservations);
var virtualCapacityPercentage: Ref<number> = ref(settingsStore.getVirtualCapacityPercentage);
var sharedStudentsTreshold: Ref<number> = ref(settingsStore.getSharedStudentsTreshold);
var preferencesTreshold: Ref<number> = ref(settingsStore.getPreferencesTreshold);
var timetableWidthInEditor: Ref<number> = ref(settingsStore.getTimetableWidthInEditor);

var startHourValid: Ref<boolean> = ref(true);
var daysValid: Ref<boolean> = ref(true);
var endHourValid: Ref<boolean> = ref(true);
var weeksInSemesterValid: Ref<boolean> = ref(true);
var virtualCapacityPercentageValid: Ref<boolean> = ref(true);
var sharedStudentsTresholdValid: Ref<boolean> = ref(true);
var preferencesTresholdValid: Ref<boolean> = ref(true);
var timetableWidthInEditorValid: Ref<boolean> = ref(true);

const alerts = ref<ComponentPublicInstance<typeof FormAlerts & { displaySuccessAlert: (alert: string) => void, displayFailureAlert: (alert: string) => void }>>()

function daysFromStore(): boolean[] {
    var result: boolean[] = Array(8).fill(false)
    for (var day of settingsStore.getDays) {
        result[day] = true;
    }
    return result;
}
function daysToStore(): WeekDaysType[] {
    var result: WeekDaysType[] = []
    for (var i = 1; i < days.value.length; i++) {
        if (days.value[i]) {
            result.push(i);
        }
    }
    return result;
}

function diplayErrors(msg: string) {
    if (msg == '') {
        alerts.value?.displaySuccessAlert('Úspěšně změněno');
    } else {
        alerts.value?.displayFailureAlert(msg);
    }
}

async function submit(): Promise<void> {
    if (!(startHourValid.value && endHourValid.value && weeksInSemesterValid.value && virtualCapacityPercentageValid.value
        && sharedStudentsTreshold.value && preferencesTresholdValid.value && timetableWidthInEditorValid.value)) {
        alerts.value?.displayFailureAlert('Pro změnu nastavení musí mít všechny kolonky validní hodnotu.');
    } else if (startHour.value >= endHour.value) {
        alerts.value?.displayFailureAlert('Den musí začínat dříve, než končí.');
    } else {
        diplayErrors(await settingsStore.setStartHour(startHour.value));
        diplayErrors(await settingsStore.setEndHour(endHour.value));
        diplayErrors(await settingsStore.setDays(daysToStore()));
        diplayErrors(await settingsStore.setWeeksInSemester(weeksInSemester.value));
        diplayErrors(await settingsStore.setDefaultPriorities(priorities.value));
        diplayErrors(await settingsStore.setDefaultReservations(reservations.value));
        diplayErrors(await settingsStore.setVirtualCapacityPercentage(virtualCapacityPercentage.value));
        diplayErrors(await settingsStore.setSharedStudentsTreshold(sharedStudentsTreshold.value));
        diplayErrors(await settingsStore.setPreferencesTreshold(preferencesTreshold.value));
        diplayErrors(await settingsStore.setTimetableWidthInEditor(timetableWidthInEditor.value));
    }
}

</script>

<style scoped>
.day-name {
    width: 5rem;
}

.basic-settings-name {
    width: 11rem;
}
</style>