<!--
 - @file NumberInput.vue
 - @description In this file is component for inserting numbers with basic validation.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <input type="number" :class="`m-1 ${valid ? '' : 'border-danger'}`"
            onkeypress='return event.charCode >= 48 && event.charCode <= 57' :value="value" @input="checkInput" 
            :min="min"/>
        <label class="text-danger m-1"> {{ alert }}</label>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { Ref } from 'vue'

// reactive variables
var alert: Ref<string> = ref('');

function checkInput(event: Event) {
    const minValue: number = min?.value ?? -999999999;
    const maxValue: number = max?.value ?? 999999999;
    const currentValue: number = parseInt((event.target as HTMLInputElement).value);
    if (!Number.isInteger(currentValue)) {
        alert.value = `Hodnota musí být celé číslo`;
        emit('update:valid', false);
    } else if (minValue > currentValue) {
        alert.value = `Hodnota musí být ${minValue} nebo vyšší.`;
        emit('update:valid', false);
    } else if (maxValue < currentValue) {
        alert.value = `Hodnota musí být ${maxValue} nebo nižší.`;
        emit('update:valid', false);
    } else {
        alert.value = '';
        emit('update:valid', true);
    }
    emit('update:value', currentValue);
}


//properties
interface Props {
    min?: number,
    max?: number,
    value: number
    valid: boolean
}
const props = defineProps<Props>()
const { min, max, value, valid } = toRefs(props);

//emiting events
const emit = defineEmits<{
    (e: 'update:value', result: number): void
    (e: 'update:valid', result: boolean): void
}>()
</script>

 