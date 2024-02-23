<!--
 - @file EditorStackUnitCard.vue
 - @description In this file is component for card with lecture. Not only for the ones which are in stack, but also for these placed in canvas.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template >
    <div :class="'card'" :id="unit.id.toString()" :style="addColorStyle()" :draggable="isDraggable()"
        @dragstart="atDragstart" @dragover.stop @dragend="atDragend" @click="freezeModeAction()"
        @mouseenter="displayDetails = true"
        @mouseleave="(unit.startTime == -1) ? displayDetails = true : displayDetails = false">
        <b class="mx-2">{{ displayName }}</b>
        <div v-show="displayDetails">
            <p class="small">Délka: {{ displayTime }} </p>
            <p class="small">{{ displayLecturers() }}</p>
            <p class="small">{{ unit.requiredCapacity }} studentů, {{ unit.compulsory ? 'povinná' : 'nepovinná' }}</p>
            <p class="small">{{ unit.periodic ? 'Periodická' : 'Bloková' }}{{ displayWeeks() }}</p>
            <p v-if="suitableRoomsNames.length > 0" class="small">Vhodné místnosti: {{ displaySuitableRooms() }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, type Ref, type StyleValue } from 'vue'
import type { IRoomTimetableUnit } from '@/interfaces/dataTypesFE';
import { UnitType } from '@/interfaces/dataTypesFE';
import { useSettingsStore } from '@/stores/SettingsStore';
import { useSocketioStore } from '@/stores/SocketioStore';
import { useCollisionStore } from '@/stores/CollisionStore';
import axios from 'axios';

var settingsStore = useSettingsStore();
var socketioStore = useSocketioStore();
var collisionStore = useCollisionStore();

interface Props {
    unit: IRoomTimetableUnit
}
const props = defineProps<Props>()
const { unit } = toRefs(props);

var displayDetails: Ref<boolean> = ref(unit.value.startTime == -1);

const displayTime = computed<string>(() => {
    const hours: number = Math.trunc(unit.value.duration / 60);
    const minutes: number = unit.value.duration % 60;
    return hours.toString() + ':' + (minutes < 10 ? '0' + minutes.toString() : minutes.toString());
});
const displayName = computed<string>(() => {
    return unit.value.subject.abbreviation + ' - ' + UnitType[unit.value.type];
});

function displayLecturers(): string {
    var first: boolean = true;
    var result: string = '';
    for (var lecturer of unit.value.lecturers) {
        if (first) {
            first = false;
        } else {
            result += ', ';
        }
        if (lecturer.titlesBefore != '') {
            result += lecturer.titlesBefore + ' ';
        }
        result += lecturer.name + ' ' + lecturer.surname;
        if (lecturer.titlesAfter != '') {
            result += ' ' + lecturer.titlesAfter;
        }
    }
    return result;
}

function displayWeeks(): string {
    if (unit.value.periodic) {
        if (settingsStore.getWeeksInSemester == unit.value.weeks.length) {
            return ', týdny: Všechny';
        }
        var even: number[] = [];
        for (var i: number = 1; i <= settingsStore.getWeeksInSemester; i++) {
            if (!(i % 2)) {
                even.push(i);
            }
        }
        if (unit.value.weeks.toString() == even.toString()) {
            return ', týdny: Sudé';
        }
        var odd: number[] = [];
        for (var i: number = 1; i <= settingsStore.getWeeksInSemester; i++) {
            if (i % 2) {
                odd.push(i);
            }
        }
        if (unit.value.weeks.toString() == odd.toString()) {
            return ', týdny: Liché';
        }
        return ', týdny: ' + unit.value.weeks.toString();
    }
    else {
        if(unit.value.startTime ==- 1){
            return ', Týden nepřiřazen';
        } else {
            return `, ${unit.value.weeks[0]}. týden`
        }
    }
}
function isDraggable() {
    if (unit.value.locked) {
        return false;
    } else if (unit.value.frozen) {
        return false;
    } else {
        return true;
    }
}

function freezeModeAction() {
    if (settingsStore.getFreezeMode) {
        if (unit.value.frozen) {
            socketioStore.unfreezeUnit(unit.value.id);
        } else {
            socketioStore.freezeUnit(unit.value.id)
        }
    }
}

function addColorStyle(): StyleValue {
    var baseColor: string = 'white';
    var strip1Color: string;
    var strip2Color: string;
    if (unit.value.locked) {
        baseColor = 'grey';
        strip1Color = 'grey';
        strip2Color = 'grey';
    } else {
        switch (unit.value.type) {
            case UnitType.Cvičení:
                baseColor = 'greenyellow';
                break;
            case UnitType.Přednáška:
                baseColor = 'yellow';
                break;
            case UnitType.Laboratoř:
                baseColor = 'CornflowerBlue';
                break;
            case UnitType.Democvičení:
                baseColor = 'darkViolet';
                break;
            case UnitType.Jiné:
                baseColor = 'burlyWood';
                break;
            case UnitType.Zkouška:
                baseColor = 'coral';
                break;
        }
        var strip1Color: string = unit.value.frozen ? 'rgb(114, 220, 255)' : baseColor;
        var strip2Color: string = collisionStore.isColliding(unit.value.id) ? 'red' : baseColor;
    }
    var borderColor: string = unit.value.periodic ? 'black' : 'blue';

    const result: StyleValue = {
        background: `repeating-linear-gradient(135deg, 
        ${strip1Color}, ${strip1Color} 1rem, 
        ${baseColor} 1rem, ${baseColor} 3rem, 
        ${strip2Color} 3rem, ${strip2Color} 4rem, 
        ${baseColor} 4rem, ${baseColor} 6rem)`, border: `${borderColor} 4px solid`
    }
    return result;
}
function atDragstart(event: DragEvent) {
    const target = event.target as HTMLElement;
    const targetUnitId: string = target.id.replace('unit-id-', '');
    if (event.dataTransfer != null) {
        event.dataTransfer.setData('cardId', targetUnitId);
    } else {
        console.log('DataTransfer is null');
    }
    socketioStore.socket.emit("lockUnit", targetUnitId);
    console.log(`[Client -> Server] lockUnit with id ${targetUnitId}`);
}
function atDragend(event: DragEvent) {
    const target = event.target as HTMLElement;
    const targetUnitId: string = target.id.replace('unit-id-', '');
    if (event.dataTransfer != null) {
        if (event.dataTransfer.dropEffect == 'none') {
            socketioStore.socket.emit("unlockUnit", targetUnitId);
        }
    }
}

//displaying suitable rooms
var suitableRoomsNames: Ref<string[]> = ref([]);
onMounted(() => {
    axios.get('http://localhost:3000/suitableRooms/' + unit.value.subject.abbreviation + '/' + unit.value.type)
        .then((response) => {
            suitableRoomsNames.value = response.data;
        })
        .catch((error) => {
            console.error(error);
        });
});

function displaySuitableRooms(): string {
    var displayString: string = '';
    var first: boolean = true;
    for (var roomName of suitableRoomsNames.value) {
        if (first) {
            displayString += `${roomName}`;
            first = false;
        } else {
            displayString += `, ${roomName}`
        }
    }
    return displayString;
}

</script>

<style scoped>
p {
    margin: 0 0 0 5px;
}

h3 {
    margin: 5px 0 0 5px;
}

.card {
    border-radius: 15px;
    margin: 2px 2px 1rem 4px;
}
</style>