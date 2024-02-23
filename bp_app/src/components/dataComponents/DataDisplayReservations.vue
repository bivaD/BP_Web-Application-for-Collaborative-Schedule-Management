<!--
 - @file DataDisplayReservations.vue
 - @description In this file is component for displaying table reservations.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <div class="my-2">
            <div v-for="day in days" :key="day">
                <label class="btn btn-custom">{{ WeekDaysType[day] }}</label>
                <button :class="`btn btn-custom ${reservations[((day - 1) * 24 + hour) - 1]}`" v-for="hour in 24" :key="hour">{{ hour }}</button>
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
import { WeekDaysType } from '@/interfaces/dataTypesFE';
import { toRefs } from 'vue';

interface Props {
    reservations: string[],
}
const props = defineProps<Props>()
const { reservations } = toRefs(props);

const days = [WeekDaysType.Po, WeekDaysType.Út, WeekDaysType.St, WeekDaysType.Čt, WeekDaysType.Pá, WeekDaysType.So, WeekDaysType.Ne];

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
</style>