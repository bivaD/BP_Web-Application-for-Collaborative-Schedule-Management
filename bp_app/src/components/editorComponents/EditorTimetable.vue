<!--
 - @file EditorTimetable.vue
 - @description In this file is component for dispalying timetable in editor.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="timetable">
      <div>
        <div class="roomInfo">
            <h3>{{ room.name }}</h3>
            <p>Kapacita: {{ room.capacity }}</p>
            <p>Virtuální kapacita: {{ Math.floor(room.capacity*settingsStore.getVirtualCapacityPercentage/100) }}</p>
            <p v-if="week">Týden: {{ week }}</p>
        </div>
        <EditorTimetableTimeline/>
        <EditorTimetableDay v-for="day in getDays" :key="day" :day="day" :week="week" :units="getUnitsForTimetable(room.name, day, week)" :room="room"></EditorTimetableDay>
      </div>
    </div>
</template>

<script setup lang="ts">
import type { IRoom, IUnit } from '@/interfaces/dataTypesFE';
import EditorTimetableDay from './EditorTimetableDay.vue';
import { useSettingsStore } from '@/stores/SettingsStore';
import { ref, toRefs } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useTimetablesStore } from '@/stores/TimetableStore';
import EditorTimetableTimeline from './EditorTimetableTimeline.vue';

interface Props {
    room: IRoom,
    week: number
}
const props = defineProps<Props>()
const { room, week } = toRefs(props);

var settingsStore = useSettingsStore();
const { getDays } = storeToRefs(settingsStore)

var timetablesStore = useTimetablesStore();
const { getUnitsForTimetable } = storeToRefs(timetablesStore)

var units:Ref<IUnit[]> = ref([]);

</script>

<style scoped>
    .roomInfo{
        display: flex;
        align-items: end;
    }
    h3{
        margin: 0;
    }
    p{
        margin:  0 0 0 2rem;
    }
    .timetable{
        border: 1px solid black;
        border-radius: 1rem;
        padding: 0 1rem 0 1rem;
        margin-bottom: .5rem;
    }
</style>