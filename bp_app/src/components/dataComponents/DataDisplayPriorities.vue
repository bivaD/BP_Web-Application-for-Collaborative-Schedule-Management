<!--
 - @file DatatDisplayPriorities.vue
 - @description In this file is component for displaying lecturers priorities.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <div v-for="day in days" :key="day">
            <label class="btn btn-custom">{{ WeekDaysType[day] }}</label>
            <button :class="'btn btn-custom prio' + priorities[((day-1)*24+hour)-1]" v-for="hour in 24" :key="hour">{{ hour-1 }}</button>
        </div>
        <div class="legend my-2">
            <label class="btn mr-2">Legenda: </label>
            <div class="btn prio0 legend_cell">nemůže</div>
            <div class="btn prio1 legend_cell">nevyhovuje</div>
            <div class="btn prio2 legend_cell"> </div>
            <div class="btn prio3 legend_cell"> </div>
            <div class="btn prio4 legend_cell"> </div>
            <div class="btn prio5 legend_cell">vyhovuje</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { WeekDaysType } from '@/interfaces/dataTypesFE';
import { toRefs } from 'vue';

interface Props {
    priorities: number[],
}
const props = defineProps<Props>()
const { priorities } = toRefs(props);

const days = [ WeekDaysType.Po, WeekDaysType.Út, WeekDaysType.St, WeekDaysType.Čt, WeekDaysType.Pá, WeekDaysType.So, WeekDaysType.Ne];

</script>

<style scoped>
.legend{
    display: flex;
}
.legend_cell{
    width: 7rem;
    border-radius: 0px;
    border: 1px black solid;
}
.prio0{
    background: rgb(121, 0, 0);
}
.prio1{
    background: orangered;
}
.prio2{
    background: orange;
}
.prio3{
    background: yellow;
}
.prio4{
    background: greenyellow;
}
.prio5{
    background: green;
}
button{
    width: 3rem;
}
.btn-custom{
    border-radius: 0px;
    border: 1px solid black;
    width: 3rem;
}

</style>