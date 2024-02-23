/**
 * @file SettingsStore.ts
 * @description This store is used for managing settings.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { WeekDaysType } from "@/interfaces/dataTypesFE";
import axios from "axios";
import { defineStore, type StoreState } from "pinia";

export const useSettingsStore = defineStore({
    id: "SettingsStore",
    state: () => ({
        days: [WeekDaysType.Po, WeekDaysType.St] as WeekDaysType[],
        startHour: 7,
        endHour: 16,
        weeksInSemester: 13,
        defaultPriorities: [
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,

            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        defaultReservations: [
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',

            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved',
        ],
        virtualCapacityPercentage: 120,
        alertDisplayTime: 5000,
        freezeMode: false,
        sharedStudentsTreshold: 30,
        preferencesTreshold: 2,
        timetableWidthInEditor: 1400,
        updated: false
    }),

    getters: {
        getDays(state): WeekDaysType[] {
            return state.days;
        },
        getStartHour(state): number {
            return state.startHour;
        },
        getEndHour(state): number {
            return state.endHour;
        },
        getDayLenght(state): number {
            return state.endHour - state.startHour;
        },
        getWeeksInSemester(state): number {
            return state.weeksInSemester;
        },
        getDefaultPriorities(state): number[] {
            return state.defaultPriorities;
        },
        getDefaultReservations(state): string[] {
            return state.defaultReservations;
        },
        getVirtualCapacityPercentage(state): number {
            return state.virtualCapacityPercentage;
        },
        getAlertDisplayTime(state): number {
            return state.alertDisplayTime;
        },
        getFreezeMode(state): boolean {
            return state.freezeMode;
        },
        getSharedStudentsTreshold(state): number {
            return state.sharedStudentsTreshold;
        },
        getPreferencesTreshold(state): number {
            return state.preferencesTreshold;
        },
        getTimetableWidthInEditor(state): number {
            return state.timetableWidthInEditor;
        },
    },
    actions: {
        synchronizeSettings(): void {
            axios.get("http://localhost:3000/settings")
                .then((response) => {
                    this.days = JSON.parse(response.data[0].value);
                    this.defaultPriorities = JSON.parse(response.data[1].value);
                    this.defaultReservations = JSON.parse(response.data[2].value);
                    this.endHour = JSON.parse(response.data[3].value);
                    this.preferencesTreshold = JSON.parse(response.data[4].value);
                    this.sharedStudentsTreshold = JSON.parse(response.data[5].value);
                    this.startHour = JSON.parse(response.data[6].value);
                    this.timetableWidthInEditor = JSON.parse(response.data[7].value);
                    this.virtualCapacityPercentage = JSON.parse(response.data[8].value);
                    this.weeksInSemester = JSON.parse(response.data[9].value);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        async saveSettings(name: string, value: any): Promise<string> {
            return axios.put('http://localhost:3000/settings/', {
                name: name,
                value: JSON.stringify(value)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                return ('');
            }).catch((error) => {
                return (error.response.data);
            });
        },
        async setWeeksInSemester(weeksInSemester: number): Promise<string> {
            this.weeksInSemester = weeksInSemester;
            return this.saveSettings('weeksInSemester', weeksInSemester);
        },
        async setDays(days: WeekDaysType[]): Promise<string> {
            this.days = days;
            return this.saveSettings('days', days);
        },
        async setStartHour(startHour: number): Promise<string> {
            this.startHour = startHour;
            return this.saveSettings('startHour', startHour);
        },
        async setEndHour(endHour: number): Promise<string> {
            this.endHour = endHour;
            return this.saveSettings('endHour', endHour);
        },
        async setDefaultPriorities(defaultPriorities: number[]): Promise<string> {
            this.defaultPriorities = defaultPriorities;
            return this.saveSettings('defaultPriorities', defaultPriorities);
        },
        async setDefaultReservations(defaultReservations: string[]): Promise<string> {
            this.defaultReservations = defaultReservations;
            return this.saveSettings('defaultReservations', defaultReservations);
        },
        async setVirtualCapacityPercentage(virtualCapacityPercentage: number): Promise<string> {
            this.virtualCapacityPercentage = virtualCapacityPercentage;
            return this.saveSettings('virtualCapacityPercentage', virtualCapacityPercentage);
        },
        toggleFreezeMode(): void {
            this.freezeMode = !this.freezeMode;
        },
        async setSharedStudentsTreshold(sharedStudentsTreshold: number): Promise<string> {
            this.sharedStudentsTreshold = sharedStudentsTreshold;
            return this.saveSettings('sharedStudentsTreshold', sharedStudentsTreshold);
        },
        async setPreferencesTreshold(preferencesTreshold: number): Promise<string> {
            this.preferencesTreshold = preferencesTreshold;
            return this.saveSettings('preferencesTreshold', preferencesTreshold);
        },
        async setTimetableWidthInEditor(timetableWidthInEditor: number): Promise<string> {
            this.timetableWidthInEditor = timetableWidthInEditor;
            return this.saveSettings('timetableWidthInEditor', timetableWidthInEditor);
        },
    }
});

