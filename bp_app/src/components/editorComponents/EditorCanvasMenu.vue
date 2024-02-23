<!--
 - @file EditorCanvasMenu.vue
 - @description In this file is component for menu, which is on top of the cenvas  in editor
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="canvas-menu bg-white">
        <label class="m-0 mx-1">Režim zobrazení:</label>
        <input class="m-0 mx-1" type="radio" id="periodic" value="Periodic" v-model="picked" @change="changeMode()"/>
        <label class="m-0 mx-1" for="periodic">Celosemestrální</label>

        <input class="m-0 mx-1" type="radio" id="weeks" value="Weeks" v-model="picked" @change="changeMode()"/>
        <label class="m-0 mx-1" for="weeks">Po týdnech</label>

        <label class="m-0 mx-1">Řadit místnosti podle:</label>
        <select @change="changeFilter()" v-model="filter" class="m-1">
            <option value="nameA">Název A-Z</option>
            <option value="nameZ">Název Z-A</option>
            <option value="capacityA">Kapacita sestupně</option>
            <option value="capacityZ">Kapacita vzestupně</option>
        </select>
        <button :class="frozenBtnClasees()" @click="settingsStore.toggleFreezeMode"> Zmrazit</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import type { Ref } from 'vue'
import { useSettingsStore } from '@/stores/SettingsStore';

var picked: Ref<string> = ref('Periodic');
var filter: Ref<string> = ref('nameA');

//emiting events
const emit = defineEmits<{
    (e: 'changeTimetableMode', mode: string): void
    (e: 'changeFilter', filterName: string): void
}>()

onMounted(()=>{
    emit('changeFilter', filter.value);
    emit('changeTimetableMode', picked.value);
});

function changeFilter() {
    emit('changeFilter', filter.value);
}

function changeMode(){
    emit('changeTimetableMode', picked.value);
}

var settingsStore = useSettingsStore();
function frozenBtnClasees() {
    var classes: string = 'btn btn-sm bi bi-snow m-1';
    if (settingsStore.getFreezeMode) {
        classes += ' btn-primary';
    } else {
        classes += ' btn-secondary';
    }
    return classes;
}
</script>

 