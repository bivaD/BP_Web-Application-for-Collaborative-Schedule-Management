<!--
 - @file EditorTimetableDayHeader.vue
 - @description In this file is component for header of timetable day.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="wrapper">
        <h1> {{ WeekDaysType[day] }}</h1>      
    </div>
</template>
<script setup lang="ts">
    import { WeekDaysType } from '@/interfaces/dataTypesFE';
    interface Props {
        day: WeekDaysType
    }
    const props = defineProps<Props>();
</script>
<style scoped>
    h1{
        text-align: center;
        color: white;
    }
    .wrapper{
        background-color: #212529;
    }
</style>