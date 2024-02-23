"use strict";
/**
 * @file TimetableController.ts
 * @description This file is controller for timetables.
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
exports.TimetablesController = void 0;
const RoomEntity_1 = require("../database/RoomEntity");
const UnitEntity_1 = require("../database/UnitEntity");
class TimetablesController {
    static getAllRoomTimetables(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var rooms = yield RoomEntity_1.Room.find();
                var timetables = [];
                for (var room of rooms) {
                    timetables.push(yield this.getRoomTimetable(room.name));
                }
                response.json(timetables);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getRoomTimetable(roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield RoomEntity_1.Room.findOne({
                where: { name: roomName },
            });
            if (room == null) {
                console.error(`Room with name ${roomName} not found.`);
                throw new Error(`Room with name ${roomName} not found.`);
            }
            var unitsInRoom = yield UnitEntity_1.Unit.find({
                where: {
                    room: { name: roomName },
                },
                relations: {
                    subject: true,
                    lecturers: true,
                },
            });
            var timetableUnitsInRoom = [];
            var timetableUnit;
            for (var unit of unitsInRoom) {
                timetableUnit = {
                    id: unit.id,
                    subject: unit.subject,
                    lecturers: unit.lecturers,
                    type: unit.type,
                    requiredCapacity: unit.requiredCapacity,
                    weeks: unit.weeks,
                    day: unit.day,
                    startTime: unit.startTime,
                    duration: unit.duration,
                    periodic: unit.periodic,
                    locked: false,
                    frozen: unit.frozen,
                    compulsory: unit.compulsory
                };
                timetableUnitsInRoom.push(timetableUnit);
            }
            var timetable = {
                room: room,
                unitsInRoom: timetableUnitsInRoom,
            };
            return timetable;
        });
    }
}
exports.TimetablesController = TimetablesController;
