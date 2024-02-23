<!--
 - @file SelectWeeks.vue
 - @description In this file is selecting weeks with basic validation.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->

<template>
    <div>
        <label>Týdny, ve ktech se lekce koná:</label> <br />
        <button class="btn btn-custom" v-for="i in settingsStore.getWeeksInSemester" :key="i" @click="markBtn(i)"
            :class="calculateClass(i)"> {{ i }}</button>
            <label v-if="!valid" class="text-danger m-1">U periodické lekce musí být vybrán minimálně jeden týden!</label>
        <br />
        <label class="btn">Předvolby:</label>

        <button class="btn btn-secondary btn-sm m-1" @click="markAllBtn">Všechny</button>
        <button class="btn btn-secondary btn-sm  m-1" @click="markEvenBtn">Sudé</button>
        <button class="btn btn-secondary btn-sm  m-1" @click="markOddBtn">Liché</button>
        <button class="btn btn-secondary btn-sm  m-1" @click="markNoneBtn">Žádný</button>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore';

var settingsStore = useSettingsStore();

//properties
interface Props {
    value: number[],
    valid: boolean
}
const props = defineProps<Props>()
const { value, valid } = toRefs(props);


function markAllBtn() {
    var newWeeksArr: number[] = [];
    for (var i: number = 1; i <= settingsStore.getWeeksInSemester; i++) {
        newWeeksArr.push(i)
    }
    emit('update:value', newWeeksArr);
    emit('update:valid', true);
}
function markNoneBtn() {
    emit('update:value', []);
    emit('update:valid', false);
}
function markEvenBtn() {
    var newWeeksArr: number[] = [];
    for (var i: number = 1; i <= settingsStore.getWeeksInSemester; i++) {
        if (!(i % 2)) {
            newWeeksArr.push(i);
        }
    }
    emit('update:value', newWeeksArr);
    emit('update:valid', true);
}
function markOddBtn() {
    var newWeeksArr: number[] = [];
    for (var i: number = 1; i <= settingsStore.getWeeksInSemester; i++) {
        if (i % 2) {
            newWeeksArr.push(i);
        }
    }
    emit('update:value', newWeeksArr);
    emit('update:valid', true);
}
function markBtn(btnNumber: number) {
    var newWeeksArr: number[] = value.value;
    const index = newWeeksArr.indexOf(btnNumber);
    if (index == -1) {
        newWeeksArr.push(btnNumber);
    } else {
        newWeeksArr.splice(index, 1);
    }
    emit('update:value', newWeeksArr.sort((a, b) => {return a-b}));
    if(newWeeksArr.length == 0){
        emit('update:valid', false);
    } else {
        emit('update:valid', true);
    }
}



//emiting events
const emit = defineEmits<{
    (e: 'update:value', result: number[]): void,
    (e: 'update:valid', result: boolean): void
}>()
function calculateClass(i: number){
    var res: string = 'unselected';
    if(value.value.indexOf(i) != -1) {
        res = 'selected'
    }

    return res;
}
</script>

<style scoped>
.selected {
    background: seagreen;
}

.btn-custom {
    width: 3rem;
    border-radius: 0;
    border: 1px black solid;
}
</style>