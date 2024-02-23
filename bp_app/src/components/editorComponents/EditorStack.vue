<!--
 - @file EditorStack.vue
 - @description In this file is component for stack in right side of the editor.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="stack-frame my-0 px-3" @dragover.prevent @drop="dropOnStack($event)">
        <EditorStackHeader class="bg-white" @change-filter="(newFilter) => { filter = newFilter; units = stackFilter(getUnitsByRoomName('unsorted')) }" />
        <div class="stack-content" @dragover.prevent :key="refresher" @drop="dropOnStack($event)">
            <EditorStackUnitCardVue v-for="unit in getUnitsByRoomName('unsorted')" :key="unit.id" :unit="unit"
                @dragover.prevent @drop="dropOnStack($event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import EditorStackHeader from './EditorStackHeader.vue';
import EditorStackUnitCardVue from './EditorStackUnitCard.vue';
import { useTimetablesStore } from '@/stores/TimetableStore';
import { useSocketioStore } from '@/stores/SocketioStore';
import { storeToRefs } from 'pinia';
import type { IRoomTimetableUnit } from '@/interfaces/dataTypesFE';
import { getCurrentInstance, ref, type ComponentInternalInstance, type Ref } from 'vue';

var timetablesStore = useTimetablesStore();
const { getUnitsByRoomName } = storeToRefs(timetablesStore);
var socketioStore = useSocketioStore();


var filter: Ref<string> = ref('nameA');
var refresher: Ref<number> = ref(0);
var units: Ref<IRoomTimetableUnit[]> = ref(stackFilter(getUnitsByRoomName.value('unsorted')));

function stackFilter(unitsToSort: IRoomTimetableUnit[]): IRoomTimetableUnit[] {
    console.log('sorted by ' + filter.value);

    switch (filter.value) {
        case 'nameZ':
            unitsToSort.sort((b, a) => { return (a.subject.abbreviation + a.type.toString()).localeCompare(b.subject.abbreviation + a.type.toString) });
            break;
        case 'durationA':
            unitsToSort.sort((b, a) => { return a.duration - b.duration });
            break;
        case 'durationZ':
            unitsToSort.sort((a, b) => { return a.duration - b.duration });
            break;
        case 'studentsA':
            unitsToSort.sort((b, a) => { return a.requiredCapacity - b.requiredCapacity });
            break;
        case 'studentsZ':
            unitsToSort.sort((a, b) => { return a.requiredCapacity - b.requiredCapacity });
        case 'nameA':
        default:
            unitsToSort.sort((a, b) => { return (a.subject.abbreviation + a.type.toString()).localeCompare(b.subject.abbreviation + a.type.toString) });
            break;
    }
    return unitsToSort;
}

function dropOnStack(event: DragEvent) {
    if (event.dataTransfer) {
        const draggedUnitId: string = event.dataTransfer.getData('cardId');
        socketioStore.socket.emit("moveUnitToStack", draggedUnitId);
        console.log(`[Client -> Server] moveUnitToStack with id ${draggedUnitId}`);
    }
}

</script>

<style scoped>
.stack-frame {
    width: 100%;
    height: 100%;
    border: 1px black solid;
    border-top-left-radius: 2rem;
    overflow-y: scroll;
}
</style>