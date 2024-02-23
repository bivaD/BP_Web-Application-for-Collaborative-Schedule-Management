"use strict";
/**
 * @file Collisions.ts
 * @description In this file is implementation of collision detection.
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
exports.Collisions = void 0;
const typeorm_1 = require("typeorm");
const SettingsEntity_1 = require("../database/SettingsEntity");
const SharedStudentsEntity_1 = require("../database/SharedStudentsEntity");
const SuitableRoomEntity_1 = require("../database/SuitableRoomEntity");
const UnitEntity_1 = require("../database/UnitEntity");
const dataTypesBE_1 = require("../interfaces/dataTypesBE");
class Collisions {
    constructor(manager) {
        this.collisions = [];
        this.manager = manager;
    }
    addCollision(unitAId, unitBId, type, explanation) {
        if (this.collisions.find((c) => { return c.type == type && ((c.unitAId == unitAId && c.unitBId == unitBId) || (c.unitAId == unitBId && c.unitBId == unitAId)); })) {
            return false;
        }
        else {
            const newCollision = {
                unitAId: unitAId,
                unitBId: unitBId,
                type: type,
                explanation: explanation,
            };
            this.collisions.push(newCollision);
            this.manager.notifyCollisionAdded(newCollision);
            return true;
        }
    }
    getAllCollisions() {
        return this.collisions;
    }
    getCollisionsOfUnit(unitId) {
        var unitCollisions = [];
        for (var collision of this.collisions) {
            if (collision.unitAId == unitId || collision.unitBId == unitId) {
                unitCollisions.push(collision);
            }
        }
        return unitCollisions;
    }
    getSettings(settingsName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield SettingsEntity_1.Settings.findOne({ where: { name: settingsName } });
                if (result == null) {
                    return -1;
                }
                else {
                    return JSON.parse(result.value);
                }
            }
            catch (error) {
                return -1;
            }
        });
    }
    refreshUnitCollisions(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.removeUnitCollisions(unitId);
            this.manager.notifyUnitCollisionsRemoved(unitId);
            yield this.findUnitCollisions(unitId);
        });
    }
    refreshStackUnitCollisions(unitId) {
        this.removeUnitCollisions(unitId);
        this.manager.notifyUnitCollisionsRemoved(unitId);
    }
    refreshAllCollisions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.collisions = [];
            this.manager.notifyAllCollisionsRemoved();
            yield this.findAllCollisions();
        });
    }
    // private methods
    timeCollision(unitA, unitB) {
        const startA = unitA.startTime;
        const startB = unitB.startTime;
        const endA = unitA.startTime + unitA.duration;
        const endB = unitB.startTime + unitB.duration;
        if ((startA <= startB && startB < endA) || //B starts in A
            (startA < endB && endB <= endA) || //B ends in A
            (startA <= startB && endB <= endA) || //B                                                                                                                                                                                                                                                                                                                                           is inside A
            (startB <= startA && endA <= endB)) { // A is inside B
            return true;
        }
        else {
            return false;
        }
    }
    intersection(arrayA, arrayB) {
        return arrayA.filter((element) => {
            for (var elementB of arrayB) {
                if (JSON.stringify(element) == JSON.stringify(elementB)) {
                    return true;
                }
            }
        });
    }
    weekCollision(unitA, unitB) {
        const commonWeeks = this.intersection(unitA.weeks, unitB.weeks);
        if (commonWeeks.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    getSharedStudents(unitA, unitB) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sharedStudents = yield SharedStudentsEntity_1.SharedStudents.findOne({
                    where: [
                        { unitA: { id: unitA.id }, unitB: { id: unitB.id } },
                        { unitA: { id: unitB.id }, unitB: { id: unitA.id } },
                    ],
                });
                if (sharedStudents == null) {
                    return 0;
                }
                else {
                    return sharedStudents.count;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    displayTime(time) {
        return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
    }
    displayUnitInfo(unit, displayRoom = true) {
        var displayString = `${unit.subject.abbreviation} - ${dataTypesBE_1.UnitType[unit.type]} v ${dataTypesBE_1.WeekDaysType[unit.day]} v čase ${this.displayTime(unit.startTime)}`;
        if (displayRoom) {
            displayString += ` v místnosti ${unit.room.name}`;
        }
        return displayString;
    }
    findUnitCollisions(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unit = yield UnitEntity_1.Unit.findOneOrFail({
                    where: { id: unitId },
                    relations: {
                        room: true,
                        lecturers: true,
                        subject: true,
                    },
                });
                //this will find all other units, which are in same day as the one, with which we are looking for collisions
                const units = yield UnitEntity_1.Unit.find({
                    where: { day: unit.day, id: typeorm_1.Not(unitId) },
                    relations: {
                        room: true,
                        lecturers: true,
                        subject: true,
                    },
                });
                for (var unitB of units) {
                    //if they have some time overlap in at least one of the weeks, then they are suspicious
                    if (this.weekCollision(unit, unitB) && this.timeCollision(unit, unitB)) {
                        this.findPlaceCollision(unit, unitB);
                        this.findLecturersCollisions(unit, unitB);
                        this.findSharedStudentsCollisions(unit, unitB);
                    }
                }
                this.findCapacityCollisions(unit);
                this.findSuitableRoomsCollision(unit);
                this.findCollisionsWithLecturersPreferences(unit);
                this.findCollisionsWithReservations(unit);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findCapacityCollisions(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (unit.compulsory) {
                if (unit.room.capacity < unit.requiredCapacity) {
                    const explanation = `[PŘEPLNĚNÁ MÍSTNOST] Místnost ${unit.room.name} nemá dostatečnou kapacitu pro povinnou lekci ${this.displayUnitInfo(unit, false)}.`;
                    this.addCollision(unit.id, unit.id, dataTypesBE_1.CollisionType.Capacity, explanation);
                }
            }
            else {
                try {
                    var virtualCapacitySettings = yield SettingsEntity_1.Settings.findOneOrFail({ where: { name: 'virtualCapacityPercentage' } });
                    if (virtualCapacitySettings != null) {
                        const virtualCapacityPercentage = JSON.parse(virtualCapacitySettings.value);
                        if (Math.floor(unit.room.capacity * virtualCapacityPercentage / 100) < unit.requiredCapacity) {
                            const explanation = `[PŘEPLNĚNÁ MÍSTNOST] Místnost ${unit.room.name} nemá dostatečnou virtuální kapacitu pro lekci ${this.displayUnitInfo(unit, false)}.`;
                            this.addCollision(unit.id, unit.id, dataTypesBE_1.CollisionType.Capacity, explanation);
                        }
                    }
                }
                catch (error) {
                    console.log('Chyba při kalkulaci nedostatečné virtuální kapacity');
                    console.log(error);
                }
            }
        });
    }
    findSharedStudentsCollisions(unit, unitB) {
        return __awaiter(this, void 0, void 0, function* () {
            const sharedStudents = yield this.getSharedStudents(unit, unitB);
            var unitAPercentage = Math.ceil((100 / unit.requiredCapacity) * sharedStudents);
            var unitBPercentage = Math.ceil((100 / unitB.requiredCapacity) * sharedStudents);
            var treshold = yield this.getSettings('sharedStudentsTreshold');
            if (unitAPercentage >= treshold) {
                const explanation = `[VYSOKÝ PŘEKRYV STUDENTŮ] - ${this.displayUnitInfo(unit)} má ${unitAPercentage}% společných studentů s ${this.displayUnitInfo(unitB)}, to je více než nastavený limit ${treshold}%`;
                this.addCollision(unit.id, unitB.id, dataTypesBE_1.CollisionType.SharedStudentsA, explanation);
            }
            if (unitBPercentage >= treshold) {
                const explanation = `[VYSOKÝ PŘEKRYV STUDENTŮ] - ${this.displayUnitInfo(unitB)} má ${unitBPercentage}% společných studentů s ${this.displayUnitInfo(unit)}, to je více než nastavený limit ${treshold}%`;
                this.addCollision(unit.id, unitB.id, dataTypesBE_1.CollisionType.SharedStudentsB, explanation);
            }
            if (sharedStudents > 0 && unit.compulsory && unitB.compulsory) {
                const explanation = `[PŘEKRYV STUDENTŮ POVINNNÝCH LEKCÍ] - ${this.displayUnitInfo(unit)} má ${sharedStudents} společných studentů s ${this.displayUnitInfo(unitB)}, přestože jsou obě lekce povinné.`;
                this.addCollision(unit.id, unitB.id, dataTypesBE_1.CollisionType.CompulsaryWithShared, explanation);
            }
        });
    }
    findLecturersCollisions(unit, unitB) {
        const lecturersIntersection = this.intersection(unit.lecturers, unitB.lecturers);
        if (lecturersIntersection.length > 0) {
            var lecturerString = "";
            for (var lecturer of lecturersIntersection) {
                lecturerString += `, ${lecturer.surname} ${lecturer.name}, ${lecturer.titlesBefore} ${lecturer.titlesAfter}`;
            }
            const explanation = `[KOLIZE PŘEDNÁŠEJÍCÍCH] - ${this.displayUnitInfo(unit)} a ${this.displayUnitInfo(unitB)} mají stejné přednášející:${lecturerString}.`;
            this.addCollision(unit.id, unitB.id, dataTypesBE_1.CollisionType.Lecturers, explanation);
        }
    }
    findPlaceCollision(unit, unitB) {
        if (unit.room.name == unitB.room.name) {
            const explanation = `[KOLIZE MÍSTA] v místnosti ${unit.room.name} - ${this.displayUnitInfo(unit, false)} a ${this.displayUnitInfo(unitB, false)}`;
            this.addCollision(unit.id, unitB.id, dataTypesBE_1.CollisionType.Place, explanation);
        }
    }
    findSuitableRoomsCollision(unit) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const suitableRooms = yield SuitableRoomEntity_1.SuitableRoom.find({ where: { unitType: unit.type, subject: { abbreviation: unit.subject.abbreviation } }, relations: { subject: true, room: true } });
            if (suitableRooms.length > 0) {
                if (!((_a = suitableRooms.find((sr) => { return sr.room.name == unit.room.name; })) !== null && _a !== void 0 ? _a : false)) {
                    const explanation = `[NEVHODNÁ MÍSTNOST] Místnost ${unit.room.name} není vhodná pro ${this.displayUnitInfo(unit, false)}.`;
                    this.addCollision(unit.id, unit.id, dataTypesBE_1.CollisionType.SuitablePlace, explanation);
                }
            }
        });
    }
    findCollisionsWithLecturersPreferences(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            var first = Math.floor(unit.startTime / 60);
            var last = Math.floor((unit.startTime + unit.duration - 1) / 60);
            var lowest_preference = 5;
            for (var lecturer of unit.lecturers) {
                for (var i = first; i <= last; i++) {
                    if (lecturer.timePriorities[((unit.day - 1) * 24 + i)] < lowest_preference) {
                        lowest_preference = lecturer.timePriorities[unit.day * i];
                    }
                }
                if (lowest_preference == 0) {
                    const explanation = `[NEMŮŽE UČIT] - ${lecturer.surname} ${lecturer.name}, ${lecturer.titlesBefore} ${lecturer.titlesAfter} nemůže učit v čase lekce ${this.displayUnitInfo(unit)}.`;
                    this.addCollision(unit.id, unit.id, dataTypesBE_1.CollisionType.Preferneces, explanation);
                }
                else if (lowest_preference <= (yield this.getSettings('preferencesTreshold'))) {
                    const explanation = `[NEPREFERUJE UČIT] - ${lecturer.surname} ${lecturer.name}, ${lecturer.titlesBefore} ${lecturer.titlesAfter} nepreferuje učit v čase lekce ${this.displayUnitInfo(unit)}. Jeho preference je ${lowest_preference}/5.`;
                    this.addCollision(unit.id, unit.id, dataTypesBE_1.CollisionType.Preferneces, explanation);
                }
                lowest_preference = 5;
            }
        });
    }
    findCollisionsWithReservations(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            var first = Math.floor(unit.startTime / 60);
            var last = Math.floor((unit.startTime + unit.duration - 1) / 60);
            for (var i = first; i <= last; i++) {
                if (unit.room.reservedHours[((unit.day - 1) * 24 + i)] == 'reserved') {
                    const explanation = `[KOLIZE S REZERVACÍ] - Lekce ${this.displayUnitInfo(unit)} je rozrhnuta na čas, který je rezervovaný pro jiné účely.`;
                    this.addCollision(unit.id, unit.id, dataTypesBE_1.CollisionType.Reservation, explanation);
                }
            }
        });
    }
    findAllCollisionsInDay(day) {
        return __awaiter(this, void 0, void 0, function* () {
            const unitsInDay = yield UnitEntity_1.Unit.find({
                where: { day: day },
                relations: {
                    room: true,
                    lecturers: true,
                    subject: true,
                },
            });
            for (var unit of unitsInDay) {
                this.findUnitCollisions(unit.id);
            }
        });
    }
    findAllCollisions() {
        return __awaiter(this, void 0, void 0, function* () {
            var allPromises = Promise.all([
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.Po),
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.Út),
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.St),
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.Čt),
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.Pá),
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.So),
                this.findAllCollisionsInDay(dataTypesBE_1.WeekDaysType.Ne),
            ]);
            try {
                yield allPromises;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    removeUnitCollisions(unitId) {
        this.collisions = this.collisions.filter((c) => {
            return !(c.unitAId == unitId || c.unitBId == unitId);
        });
    }
}
exports.Collisions = Collisions;
