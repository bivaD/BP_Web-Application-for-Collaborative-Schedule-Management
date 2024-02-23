<!--
 - @file EditorMain.vue
 - @description In this file is main component for editor.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="stack-canvas-wrapper">
        <div class="canvas-console-wrapper">
            <div class="canvas mx-3">
                <EditorCanvasMenu @change-filter="(newFilter) => { filter = newFilter }"
                    @change-timetable-mode="(np) => { picked = np }" />
                <div v-if="picked == 'Periodic'">
                    <EditorTimetable class="timetable" v-for="room in roomFilter()" :key="room.name" :room="room" :week="0">
                    </EditorTimetable>
                </div>
                <div v-else class="rooms-all">
                    <div class="weeks-in-room" v-for="room in roomFilter()" :key="room.name">
                        <EditorTimetable :style="calculateTtWidth()" v-for="week in settingsStore.weeksInSemester"
                            :key="week" :room="room" :week="week" />
                    </div>
                </div>
            </div>
            <EditorConsole v-show="consoleOn" class="console mb-0 mt-1" @close="consoleOn = false" />
            <button v-show="!consoleOn" class="btn btn-danger bi-exclamation-triangle-fill open-console-button"
                @click="consoleOn = true"></button>
        </div>
        <div class="stack">
            <EditorStack></EditorStack>
        </div>
    </div>
</template>

<script setup lang="ts">
import EditorTimetable from './EditorTimetable.vue';
import EditorConsole from './EditorConsole.vue';
import EditorStack from './EditorStack.vue';
import EditorCanvasMenu from './EditorCanvasMenu.vue';
import { onMounted, type Ref, ref, type StyleValue } from 'vue';
import { useTimetablesStore } from '@/stores/TimetableStore';
import { useSettingsStore } from '@/stores/SettingsStore';
import { useSocketioStore } from '@/stores/SocketioStore';
import { useCollisionStore } from '@/stores/CollisionStore';
import type { IRoom } from '@/interfaces/dataTypesFE';
import { storeToRefs } from 'pinia';


var settingsStore = useSettingsStore();
var timetablesStore = useTimetablesStore();
const { getAllRooms } = storeToRefs(timetablesStore)

var socketioStore = useSocketioStore();
var collisionsStore = useCollisionStore();

var picked: Ref<string> = ref('Periodic');
var filter: Ref<string> = ref('nameA');
var consoleOn: Ref<boolean> = ref(true);
var rooms: Ref<IRoom[]> = ref(getAllRooms);


onMounted(() => {
    socketioStore.listeners();
    timetablesStore.fetchTimetables();
    collisionsStore.fetchCollisions();
    roomFilter()
});

//todos 

// page not found a home redirect
function calculateTtWidth(): StyleValue {
    var width: number = settingsStore.getTimetableWidthInEditor;
    var result: StyleValue = { width: width + 'px', flexShrink: 0 }
    return result;
}


function roomFilter(): IRoom[] {
    switch (filter.value) {
        case 'nameZ':
            return rooms.value.sort((b, a) => { return a.name.localeCompare(b.name) });
        case 'capacityA':
            return rooms.value.sort((b, a) => { return a.capacity - b.capacity });
        case 'capacityZ':
            return rooms.value.sort((a, b) => { return a.capacity - b.capacity });
        case 'nameA':
        default:
            return rooms.value.sort((a, b) => { return a.name.localeCompare(b.name) });
    }
}
</script>

<style scoped>
.canvas-menu {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 42;
}

.stack-canvas-wrapper {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
}

.canvas-console-wrapper {
    height: 95vh;
    grid-column: 1 / 5;

    display: flex;
    flex-direction: column;
}

.stack {
    grid-column: 5;
    width: 100%;
    top: 0;
    height: 97vh;
    padding-bottom: 3vh;
    overflow-y: hidden;
}

.canvas {
    flex-basis: 100%;
    overflow-y: scroll;
}

.console {
    height: 100%;
    flex-basis: 20%;
    padding-bottom: 2vh;
}

.rooms-all {
    display: block;
}

.weeks-in-room {
    display: flex;
}

.open-console-button {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
}
</style>