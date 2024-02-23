<!--
 - @file EditorTimetableTimeline.vue
 - @description In this file is component for timeline, which is in top part of timetables in canvas.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="wrapper">
        <div class="day-wrapper" :style="gridTemplate">
            <p class="hour-cell" v-for="hour in getDayLenght" 
                :key="hour"
                :style="`grid-column: ${hour*60+1} / span 60;`">
                {{ getStartHour + hour-1 }}:00
            </p>
        </div>
    </div>
</template>
<!-- overflow of duration in timetable -->
<script setup lang="ts">
    import { ref } from 'vue'
    import type { Ref, StyleValue } from 'vue'
    import { storeToRefs } from 'pinia';
    import { useSettingsStore } from '@/stores/SettingsStore';


    var settingsStore = useSettingsStore();
    const { getDayLenght, getStartHour } = storeToRefs(settingsStore)

    var gridTemplate:Ref<StyleValue> = ref({gridTemplateColumns: '1fr '.repeat(60 + getDayLenght.value * 60)});
    
</script>

<style scoped>
    .wrapper {
        width:100%;
        height: 30px;
    }
    .day-wrapper{
        display: grid;
        gap: 0;
        width: 100%;
        height: 100%;
    }
    .hour-cell{
        height: 100%;
        grid-row: 1 / span 1;
        margin: 0;
        margin-left: 1em;
    }
</style>