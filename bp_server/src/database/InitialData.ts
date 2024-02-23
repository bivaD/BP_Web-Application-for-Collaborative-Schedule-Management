/**
 * @file InitialData.ts
 * @description In this file are methods for importing initial database data.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { WeekDaysType } from "../interfaces/dataTypesBE";
import { Room } from "./RoomEntity";
import { Settings } from "./SettingsEntity";

export class InitialData {
    static initializeDatabaseData() {
        this.addDefaultRoom();
        this.addAllMissingSettings();
    }
    private static addDefaultRoom() {
        const DEFAULT_ROOM_CAPACITY = 424242; //just big number unreal for real-life scenarios
        const defaultRoom: Room = Room.create({
            name: "unsorted",
            capacity: DEFAULT_ROOM_CAPACITY,
        });
        Room.save(defaultRoom);
    }
    private static async addAllMissingSettings() {
        this.addOneMissingSettings('days', [WeekDaysType.Po, WeekDaysType.Út]);
        this.addOneMissingSettings('startHour', 7);
        this.addOneMissingSettings('endHour', 16);
        this.addOneMissingSettings('weeksInSemester', 13);
        this.addOneMissingSettings('defaultPriorities', [ 
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0, 0,
            
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]);
        this.addOneMissingSettings('defaultReservations', [ 
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved',

            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved',
            'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved', 'reserved',
        ]);
        this.addOneMissingSettings('virtualCapacityPercentage', 120);
        this.addOneMissingSettings('sharedStudentsTreshold', 30);
        this.addOneMissingSettings('preferencesTreshold', 2);
        this.addOneMissingSettings('timetableWidthInEditor', 1400);
    }

    private static async addOneMissingSettings(name: string, value: any) {
        var settings: Settings | null = await Settings.findOne({ where: { name: name } })
        if (settings != null) {
            return;
        }
        settings = Settings.create({
            name: name,
            value: JSON.stringify(value)
        });
        settings.save();
    }
}