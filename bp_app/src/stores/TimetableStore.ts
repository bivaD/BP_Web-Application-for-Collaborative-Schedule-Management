/**
 * @file TimetableStore.ts
 * @description This store is used for managing timetable data.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { WeekDaysType, type IRoom, type IRoomTimetable, type IRoomTimetableUnit } from "@/interfaces/dataTypesFE";
import axios from "axios";
import { defineStore } from "pinia";

export const useTimetablesStore = defineStore({
    id: "RoomTimetableStores",
    state: () => ({
        timetables: [] as IRoomTimetable[],
    }),
  
    getters: {
        getUnitById(state): (unitID: string) => IRoomTimetableUnit | null {
            return (unitID: string): IRoomTimetableUnit | null => {
                for(var tt of state.timetables){
                    for(var unit of tt.unitsInRoom){
                        if(unit.id == unitID){
                            return unit;
                        }
                    }
                }
                return null;
            }
        },
        getUnitsByRoomName(state): (roomName: string) => IRoomTimetableUnit[] {
            return (roomName: string): IRoomTimetableUnit[] => {
              const timetable: IRoomTimetable | undefined = state.timetables.find((timetable: IRoomTimetable) => timetable.room.name === roomName);
              return timetable == undefined ? [] : timetable.unitsInRoom;
            }
        },
        getUnitsForTimetable(state): (roomName: string, day: WeekDaysType, week: number) => IRoomTimetableUnit[] {
            return (roomName: string, day: WeekDaysType, week: number): IRoomTimetableUnit[] => {
              const timetable: IRoomTimetable | undefined = state.timetables.find((timetable: IRoomTimetable) => {return timetable.room.name == roomName});
              if(timetable == undefined){
                return [];
              } else {
                var wantedUnits: IRoomTimetableUnit[] = [];
                for(var unit of timetable.unitsInRoom){
                    if(unit.day == day){
                        for(var weeksWeek of unit.weeks){
                            if(weeksWeek == week || week == 0){
                                wantedUnits.push(unit);
                                break;
                            }
                        }
                    } else {
                    }
                }
                return wantedUnits;
              } 
            }
        },
        getAllRooms(state): IRoom[] {
            var rooms: IRoom[] = [];
            for(var timetable of state.timetables){
                if(timetable.room.name != "unsorted"){
                    rooms.push(timetable.room);
                }
            }
            return rooms;
        },
        getAll(state): IRoomTimetable[] {
            return state.timetables;
        },
    },
    actions: {
        fetchTimetables() {
            axios.get("http://localhost:3000/rooms/timetables")
            .then((response) => {
                this.timetables = response.data;
            })
            .catch((error) => {
                console.error(error);
            });
        },
        addTimetable(timetable: IRoomTimetable) {
            this.timetables.push(timetable);
        },
 
        moveUnit(unitId: string, toRoom: string, toDay: WeekDaysType, toTime: number, toWeeks?:number[]) {
            var indexTimetable: number = this.findTimetableIndexByUnitId(unitId);
            var unitIndex: number = this.findUnitIndex(unitId, indexTimetable);
            var sourceTimetableIndex: number = this.findTimetableIndexByRoomName(toRoom);
            var unit:IRoomTimetableUnit = (this.timetables[indexTimetable].unitsInRoom.splice(unitIndex, 1))[0];
                    
            unit.day = toDay ?? WeekDaysType.unset;
            unit.startTime = toTime ?? -1;
            unit.weeks = unit.periodic ? unit.weeks : toWeeks??unit.weeks;
            
            this.timetables[sourceTimetableIndex].unitsInRoom.push(unit);
        },

        moveUnitToStack(unitId: string) {
            console.error('Finding tt index for ' + unitId);

            var indexTimetable: number = this.findTimetableIndexByUnitId(unitId);
            var unitIndex: number = this.findUnitIndex(unitId, indexTimetable);
            var stackIndex: number = this.findTimetableIndexByRoomName("unsorted");
            var unit:IRoomTimetableUnit = (this.timetables[indexTimetable].unitsInRoom.splice(unitIndex, 1))[0];
        
            unit.day = WeekDaysType.unset;
            unit.startTime = -1;
            unit.weeks = unit.periodic ? unit.weeks : [];
            
            this.timetables[stackIndex].unitsInRoom.push(unit);
        },

        addUnit(unit: IRoomTimetableUnit) {
            const index = this.findTimetableIndexByRoomName("unsorted");
            if (index !== -1) {
                this.timetables[index].unitsInRoom.push(unit);
            } else {
                console.log("Missing default room!");
            }
        },

        lockUnit(unitId: string){
            const ttIndex: number = this.findTimetableIndexByUnitId(unitId);
            const unitIndex: number = this.findUnitIndex(unitId, ttIndex);
            this.timetables[ttIndex].unitsInRoom[unitIndex].locked = true;
        },
        
        unlockUnit(unitId: string){
            const ttIndex: number = this.findTimetableIndexByUnitId(unitId);
            const unitIndex: number = this.findUnitIndex(unitId, ttIndex);
            this.timetables[ttIndex].unitsInRoom[unitIndex].locked = false;
        },

        freezeUnit(unitId: string){
            const ttIndex: number = this.findTimetableIndexByUnitId(unitId);
            const unitIndex: number = this.findUnitIndex(unitId, ttIndex);
            this.timetables[ttIndex].unitsInRoom[unitIndex].frozen = true;
        },
        
        unfreezeUnit(unitId: string){
            const ttIndex: number = this.findTimetableIndexByUnitId(unitId);
            const unitIndex: number = this.findUnitIndex(unitId, ttIndex);
            this.timetables[ttIndex].unitsInRoom[unitIndex].frozen = false;
        },

        
        findTimetableIndexByRoomName(roomName: string) {
            return this.timetables.findIndex((x) => x.room.name == roomName);
        },

        findTimetableIndexByUnitId(unitId: string) {
            for(var i: number = 0; i < this.timetables.length; i++){                    
                const index = this.timetables[i].unitsInRoom.findIndex((x) => {
                    return x.id == unitId
                });
                if(index != -1){
                    return i;
                }
            }
            console.error('Unit not found in any of rooms ' + unitId);
            return -1;
        },
        findUnitIndex(unitId: string, timetableIndex: number) {
            return this.timetables[timetableIndex].unitsInRoom.findIndex((x) => x.id == unitId);
        }
    }
});

