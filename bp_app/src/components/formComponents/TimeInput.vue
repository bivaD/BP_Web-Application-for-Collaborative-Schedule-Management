<!--
 - @file TimeInput.vue
 - @description In this file is component for inserting time with basic validation.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <input 
        type="number"
        :class="`m-1 ${valid ? '' : 'border-danger'}`"
        onkeypress='return event.charCode >= 48 && event.charCode <= 57' 
        :value="Math.floor(value/60)"
        :min="0"
        @input="checkHoursInput"/> 
        <label>h</label>
        <input 
        type="number"
        :class="`m-1 ${valid ? '' : 'border-danger'}`"
        onkeypress='return event.charCode >= 48 && event.charCode <= 57' 
        :value="value%60"
        :min="0"
        @input="checkMinutesInput"/> 
        <label>min</label>
        <label class="text-danger m-1"> {{ alert }}</label>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import type { Ref } from 'vue'

// reactive variables
var alert:Ref<string> = ref('');


function checkMinutesInput(event: Event){
    const currentValue: number = parseInt((event.target as HTMLInputElement).value);
    checkInput(currentValue, Math.floor(value.value/60));
}
function checkHoursInput(event: Event){
    const currentValue: number = parseInt((event.target as HTMLInputElement).value);
    checkInput(value.value%60, currentValue);
}
function checkInput(inputMinutes: number, inputHours: number){
    const minHoursValue: number = 0;
    const maxHoursValue: number = 23;

    const minMinutesValue: number = 0;
    const maxMinutesValue: number = 59;

    const minTimeValue: number = minTime?.value ?? 0;

    if(Number.isNaN(inputMinutes)){
        inputMinutes = 0;
    }
    if(Number.isNaN(inputHours)){
        inputHours = 0;
    }
    if(minHoursValue > inputHours || inputHours > maxHoursValue){
        alert.value = `Hodnota hodin musí být v rozmezí ${minHoursValue} - ${maxHoursValue}.`;
        emit('update:valid', false);
    } else if (minMinutesValue > inputMinutes || inputMinutes > maxMinutesValue){
        alert.value = `Hodnota minut musí být v rozmezí ${minMinutesValue} - ${maxMinutesValue}.`;
        emit('update:valid', false);
    } else if(!(/^[0-9]+$/.test(inputHours.toString())) || !(/^[0-9]+$/.test(inputMinutes.toString()))){
        alert.value = `Hodnoty mohou obsahovat pouze číslice.`;
        emit('update:valid', false);
    } else if (inputHours*60 + inputMinutes < minTimeValue) {
        alert.value = `Hodnota musí být alespoň ${minTimeValue} minut.`;
        emit('update:valid', false);
    } else {
        alert.value = '';
        emit('update:valid', true);
    }
    emit('update:value', inputHours*60 + inputMinutes);
}
//properties
interface Props {
    minTime?: number,
    value: number,
    valid: boolean
}
const props = defineProps<Props>()
const { minTime, value, valid } = toRefs(props);

//emiting events
const emit = defineEmits<{
    (e: 'update:value', result: number): void
    (e: 'update:valid', result: boolean): void}>()

</script>

<style scoped>

</style>