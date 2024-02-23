"use strict";
/**
 * @file InitialData.ts
 * @description In this file are methods for importing initial database data.
 * @author David Novák
 * @created 9. March 2023
 *
 * This code is part of a bachelor's thesis at the FIT BUT.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialData = void 0;
const dataTypesBE_1 = require("../interfaces/dataTypesBE");
const RoomEntity_1 = require("./RoomEntity");
const SettingsEntity_1 = require("./SettingsEntity");
class InitialData {
    static initializeDatabaseData() {
        this.addDefaultRoom();
        this.addAllMissingSettings();
    }
    static addDefaultRoom() {
        const DEFAULT_ROOM_CAPACITY = 424242; //just big number unreal for real-life scenarios
        const defaultRoom = RoomEntity_1.Room.create({
            name: "unsorted",
            capacity: DEFAULT_ROOM_CAPACITY,
        });
        RoomEntity_1.Room.save(defaultRoom);
    }
    static addAllMissingSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addOneMissingSettings('days', [dataTypesBE_1.WeekDaysType.Po, dataTypesBE_1.WeekDaysType.Út]);
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
        });
    }
    static addOneMissingSettings(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var settings = yield SettingsEntity_1.Settings.findOne({ where: { name: name } });
            if (settings != null) {
                return;
            }
            settings = SettingsEntity_1.Settings.create({
                name: name,
                value: JSON.stringify(value)
            });
            settings.save();
        });
    }
}
exports.InitialData = InitialData;
