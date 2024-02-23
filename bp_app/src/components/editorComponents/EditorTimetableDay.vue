<!--
 - @file EditorTimetableDay.vue
 - @description In this file is component for displaying day in timetable in editor canvas.
 - @author David Novák
 - @created 9. March 2023
 - 
 - This code is part of a bachelor's thesis at the FIT BUT.
-->
<template>
    <div class="wrapper">
        <div class="day-wrapper" :style="gridTemplate">
            <EditorTimetableDayHeader :day="day" class="day-header first-row" :style="`grid-column: 1 / span 60;`"
                @dragover.prevent @drop="openExactTimePrompt($event)" />

            <div v-for="hour in settingsStore.getDayLenght" :key="hour" :class="`cell ${reservaionStatus(hour, day, room)}`"
                :style="`grid-column: ${hour * 60} / span 60;`" :id="`hour-cell-${hour + settingsStore.getStartHour - 1}`"
                @dragover.prevent @drop="dropOnTimePrep($event, (hour + settingsStore.getStartHour - 1) * 60)">
            </div>
            <EditorStackUnitCard v-for="unit in calculateUnitsRow()" :class="`unit-cell`" :key="unit.unit.id"
                :unit="unit.unit" :style="calculateUnitPosition(unit)" :id="`unit-id-${unit.unit.id}`" @dragover.prevent
                @drop="dropOnUnit($event, unit.unit.id)">
            </EditorStackUnitCard>
        </div>
        <EditorExactTimePrompt :isToggled="isTimePromptOpen" :unitId="draggedUnitId" @close="isTimePromptOpen = false"
            @save="dropOnTime" />
    </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { Ref, StyleValue } from 'vue'
import EditorTimetableDayHeader from './EditorTimetableDayHeader.vue';
import EditorStackUnitCard from './EditorStackUnitCard.vue';
import EditorExactTimePrompt from './EditorExactTimePrompt.vue';
import type { IRoom, IRoomTimetableUnit, WeekDaysType } from '@/interfaces/dataTypesFE';
import { useSettingsStore } from '@/stores/SettingsStore';
import { useSocketioStore } from '@/stores/SocketioStore';

interface Props {
    day: WeekDaysType,
    room: IRoom,
    units: IRoomTimetableUnit[],
    week: number
}
const props = defineProps<Props>()
const { day, room, units, week } = toRefs(props);


var settingsStore = useSettingsStore();
var socketioStore = useSocketioStore();

var gridTemplate: Ref<StyleValue> = ref({ gridTemplateColumns: '1fr '.repeat(60 + settingsStore.getDayLenght * 60) });

function reservaionStatus(hour: number, day: number, room: IRoom): string {
    const index = (day - 1) * 24 + (settingsStore.startHour + hour) - 1;

    const reservaionStatus: string = room.reservedHours[index];
    return reservaionStatus;
}
function timeCollision(unitA: IRoomTimetableUnit, unitB: IRoomTimetableUnit): boolean {
    const startA = unitA.startTime;
    const startB = unitB.startTime;
    const endA = unitA.startTime + unitA.duration;
    const endB = unitB.startTime + unitB.duration;
    if ((startA <= startB && startB < endA) || //B starts in A
        (startA < endB && endB <= endA) ||   //B ends in A
        (startA <= startB && endB <= endA) || //B                                                                                                                                                                                                                                                                                                                                           is inside A
        (startB <= startA && endA <= endB)) { // A is inside B
        return true;
    } else {
        return false;
    }
}

function intersection<T>(arrayA: T[], arrayB: T[]): T[] {
    return arrayA.filter((element) => {
        for (var elementB of arrayB) {
            if (JSON.stringify(element) == JSON.stringify(elementB)) {
                return true;
            }
        }
    });
}

function weekCollision(unitA: IRoomTimetableUnit, unitB: IRoomTimetableUnit): boolean {
    const commonWeeks = intersection(unitA.weeks, unitB.weeks);
    if (commonWeeks.length > 0) {
        return true;
    } else {
        return false;
    }
}
interface IUnitDisplayInfo {
    unit: IRoomTimetableUnit,
    numberOfCollisions: number,
    row: number
}

function calculateUnitsRow(): IUnitDisplayInfo[] {
    var processedUnits: IUnitDisplayInfo[] = [];
    for (var unit of units.value) {
        var processedUnit: IUnitDisplayInfo = {
            unit: unit,
            numberOfCollisions: 0,
            row: 1
        }
        for (var unitB of units.value) {
            if (unit.id == unitB.id) {
                continue;
            }
            //week 0 means that periodic style of timetable is on => i need to separate lessons even if they dont have common week
            if ((props.week == 0 || weekCollision(unit, unitB)) && timeCollision(unit, unitB)) {
                processedUnit.numberOfCollisions++;
            }
        }
        processedUnits.push(processedUnit);
    }
    var somethingChanged = true;
    var i: number = 0;
    while (somethingChanged) {
        somethingChanged = false;
        for (var pUnit of processedUnits) {
            for (var pUnitB of processedUnits) {
                if (pUnit.unit.id == pUnitB.unit.id) {
                    continue;
                }
                if (pUnit.row == pUnitB.row && (props.week == 0 || weekCollision(pUnit.unit, pUnitB.unit)) && timeCollision(pUnit.unit, pUnitB.unit)) {
                    if (pUnit.numberOfCollisions > pUnitB.numberOfCollisions) {
                        pUnit.row++;
                    } else if (pUnit.numberOfCollisions < pUnitB.numberOfCollisions) {
                        pUnitB.row++;
                    } else {
                        if (pUnit.unit.weeks.length < pUnitB.unit.weeks.length) {
                            pUnit.row++;
                        } else if (pUnit.unit.weeks.length > pUnitB.unit.weeks.length) {
                            pUnitB.row++;
                        } else {
                            //just randomly send one down
                            pUnitB.row++;
                        }
                    }
                    somethingChanged = true;
                }
            }
        }
    }
    return processedUnits;
}

function calculateUnitPosition(unit: IUnitDisplayInfo): StyleValue {
    var start: number = unit.unit.startTime + 60 - (settingsStore.getStartHour * 60);
    var end: number = start + unit.unit.duration;
    var displayValue: string = 'block';

    if (end > (settingsStore.getEndHour - settingsStore.getStartHour) * 60 + 60) {
        end = (settingsStore.getEndHour - settingsStore.getStartHour) * 60 + 60;
    }
    if (start >= (settingsStore.getEndHour - settingsStore.getStartHour) * 60 + 60) {
        displayValue = 'none';
    }
    if (start < 60) {
        start = 60;
    }
    if (end <= 60) {
        displayValue = 'none';
    }
    var result: StyleValue = { gridColumn: start + ' / ' + end, gridRow: unit.row + ' / span ' + 1, display: displayValue }
    return result;
}


var draggedUnitId: Ref<string> = ref('');


//dropping unit on exact time
var isTimePromptOpen: Ref<boolean> = ref(false);

function openExactTimePrompt(event: DragEvent) {
    if (event.dataTransfer != null) {
        draggedUnitId.value = event.dataTransfer.getData('cardId');
        isTimePromptOpen.value = true;
    }
}

function dropOnTime(unitId: string, time: number) {
    socketioStore.socket.emit('moveUnit', unitId, room.value.name, day.value, time, [week.value]);
    console.log(`[Client -> Server] moveUnit with id ${unitId} to ${room.value} at day ${day.value} on time ${time}`);
}

//droping to full hour
function dropOnTimePrep(event: DragEvent, time: number) {
    if (event.dataTransfer != null) {
        draggedUnitId.value = event.dataTransfer.getData('cardId');
        dropOnTime(draggedUnitId.value, time);
    }
}

//replacing unit
function dropOnUnit(event: DragEvent, targetUnitId: string) {
    if (event.dataTransfer != null) {
        draggedUnitId.value = event.dataTransfer.getData('cardId');
        if (draggedUnitId.value == targetUnitId) {
            socketioStore.unlockUnit(targetUnitId);
            return;
        }
        socketioStore.socket.emit('replaceUnit', draggedUnitId.value, targetUnitId, week.value);
        console.log(`[Client -> Server] replaceUnit ${targetUnitId} with ${draggedUnitId.value} in week ${week.value}`);
    }
}
</script>

<style scoped>
.wrapper {
    width: 100%;
    height: auto;
}

.day-wrapper {
    display: grid;
    gap: 0;
    width: 100%;
    height: 100%;
}

.cell {
    border: 1px solid black;
    height: 100%;
    grid-row: 1 / 42;
}

.reserved {
    background: rgb(255, 0, 0);
}

.free {
    background: #6c757d;
}

.unit-cell {
    height: 1fr;
}

.day-header {
    grid-column: 1 / span 60;
    grid-row: 1/ span 1;
    border: 1px solid black;
    height: 100%;
    grid-row: 1 / 42;
}

.first-row {
    grid-row-start: 1;
    grid-row-end: 40;
}
</style>