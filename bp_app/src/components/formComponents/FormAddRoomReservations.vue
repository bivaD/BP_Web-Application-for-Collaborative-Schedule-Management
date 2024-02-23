<!--
 - @file FormAddRoomReservations.vue
 - @description In this file is component with form for inserting room reservations.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <label class="hint">Kliknutím změníte stav rezervace.</label>
        <div class="my-2">
            <div v-for="day in days" :key="day">
                <label class="btn btn-custom">{{ WeekDaysType[day] }}</label>
                <button :class="`btn btn-custom ${selectedReservations[((day - 1) * 24 + hour) - 1]}`"
                    @click="modifyReservation(day, hour)" v-for="hour in 24" 
                    :key="hour">{{ hour-1 }}</button>
            </div>
        </div>
        <div class="legend my-2">
            <label class="btn mr-2">Legenda: </label>
            <div class="btn reserved legend_cell text-nowrap">rezervováno mimo systém/areál uzavřen</div>
            <div class="btn free legend_cell">volno</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { Ref } from 'vue'
import { WeekDaysType } from '@/interfaces/dataTypesFE';

const emit = defineEmits<{
    (e: 'reservationsChange', selectedReservations: string[]): void
}>()


//properties
interface Props {
    currentReservations: string[],
}
const props = defineProps<Props>()
const { currentReservations } = toRefs(props);

const days = [WeekDaysType.Po, WeekDaysType.Út, WeekDaysType.St, WeekDaysType.Čt, WeekDaysType.Pá, WeekDaysType.So, WeekDaysType.Ne];
var selectedReservations: Ref<string[]> = ref(currentReservations);

function modifyReservation(day: WeekDaysType, hour: number) {
    const currentValue = selectedReservations.value[((day - 1) * 24 + hour) - 1];
    console.log('cv is ' + typeof currentValue + ' ' + currentValue);
    if (currentValue === 'free') {
        selectedReservations.value[((day - 1) * 24 + hour) - 1] = 'reserved';
    } else {
        selectedReservations.value[((day - 1) * 24 + hour) - 1] = 'free';
    }

    emit('reservationsChange', selectedReservations.value);
}
</script>

<style scoped>
.legend {
    display: flex;
}

.legend_cell {
    width: 7rem;
    border-radius: 0px;
    border: 1px black solid;
}

.reserved {
    background: rgb(121, 0, 0);
    width: 20rem;
}

.free {
    background: green;
}

button {
    width: 3rem;
}

.btn-custom {
    border-radius: 0px;
    border: 1px solid black;
    width: 3rem;
}

.hint{
    color: gray;
}
</style>