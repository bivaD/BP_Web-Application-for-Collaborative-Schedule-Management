"use strict";
/**
 * @file UnitsController.ts
 * @description This file is controller for units.
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
exports.UnitController = void 0;
const LecturerEntity_1 = require("../database/LecturerEntity");
const RoomEntity_1 = require("../database/RoomEntity");
const SharedStudentsEntity_1 = require("../database/SharedStudentsEntity");
const SubjectEntity_1 = require("../database/SubjectEntity");
const UnitEntity_1 = require("../database/UnitEntity");
const dataTypesBE_1 = require("../interfaces/dataTypesBE");
class UnitController {
    static getAllUnits(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var units = yield UnitEntity_1.Unit.find({
                    relations: {
                        subject: true,
                        room: true,
                        lecturers: true
                    }
                });
                response.json(units);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllUnitsByLecturer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unitsByLecturer = [];
                var units = yield UnitEntity_1.Unit.find({
                    relations: {
                        subject: true,
                        room: true,
                        lecturers: true
                    }
                });
                for (var unit of units) {
                    var index = unit.lecturers.findIndex((lecturer) => { return lecturer.id == request.params.id; });
                    if (index != -1) {
                        unitsByLecturer.push(unit);
                    }
                }
                response.json(unitsByLecturer);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllUnitsByRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unitsByRoom = [];
                var units = yield UnitEntity_1.Unit.find({
                    relations: {
                        subject: true,
                        room: true,
                        lecturers: true
                    }
                });
                for (var unit of units) {
                    if (unit.room.name == request.params.name) {
                        unitsByRoom.push(unit);
                    }
                }
                response.json(unitsByRoom);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllUnitsBySubject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unitsBySubject = [];
                var units = yield UnitEntity_1.Unit.find({
                    relations: {
                        subject: true,
                        room: true,
                        lecturers: true
                    }
                });
                for (var unit of units) {
                    if (unit.subject.abbreviation == request.params.abbreviation) {
                        unitsBySubject.push(unit);
                    }
                }
                response.json(unitsBySubject);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllUnsortedUnits(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var units = yield UnitEntity_1.Unit.find();
                response.json(units);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllStudents(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var units = yield UnitEntity_1.Unit.find({
                    relations: {
                        subject: true,
                        room: true,
                        lecturers: true
                    }
                });
                var sharedStudentsTable = [];
                for (var unit of units) {
                    var row = {
                        unitId: unit.id,
                        unitName: unit.subject.abbreviation + " - " + dataTypesBE_1.UnitType[unit.type],
                        count: []
                    };
                    for (var unitB of units) {
                        if (unit.id == unitB.id) {
                            row.count.push('X');
                            continue;
                        }
                        else {
                            const shared = yield SharedStudentsEntity_1.SharedStudents.findOne({
                                where: [
                                    { unitA: { id: unit.id }, unitB: { id: unitB.id } },
                                    { unitB: { id: unit.id }, unitA: { id: unitB.id } },
                                ]
                            });
                            if (shared == null) {
                                row.count.push(`nezadáno`);
                            }
                            else {
                                row.count.push(`${shared.count}`);
                            }
                        }
                    }
                    sharedStudentsTable.push(row);
                }
                response.json(sharedStudentsTable);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addSharedStudents(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unit = yield UnitEntity_1.Unit.findOne({ where: { id: request.body.unitAId } });
                if (unit == null) {
                    response.status(404).json(`Lekce s ID "${request.body.unitAId}" neexistuje!`);
                    return;
                }
                var unit = yield UnitEntity_1.Unit.findOne({ where: { id: request.body.unitBId } });
                if (unit == null) {
                    response.status(404).json(`Lekce s ID "${request.body.unitBId}" neexistuje!`);
                    return;
                }
                var sharedStudents = SharedStudentsEntity_1.SharedStudents.create({
                    unitA: request.body.unitAId,
                    unitB: request.body.unitBId,
                    count: request.body.count
                });
                yield sharedStudents.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Kolize mezi lekcemi ${request.body.unitAId} a ${request.body.unitBId} úspěšně přidána.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getOneUnit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unit = yield UnitEntity_1.Unit.findOne({
                    where: { id: request.params.id },
                    relations: {
                        subject: true,
                        room: true,
                        lecturers: true
                    }
                });
                if (unit == null) {
                    response.status(404).json(`Lekce s ID "${request.params.id}" neexistuje!`);
                    return;
                }
                response.json(unit);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addUnit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: request.body.subjectAbbreviation } });
                if (subject == null) {
                    response.status(404).json(`Předmět se zkratkou "${request.body.subjectAbbreviation}" nexistuje!`);
                    return;
                }
                var room = yield RoomEntity_1.Room.findOne({ where: { name: 'unsorted' } });
                if (room == null) {
                    response.status(404).json(`V systému chybí defaultní místnost!`);
                    return;
                }
                var lecturers = [];
                for (var lect of request.body.lecturers) {
                    const lecturer = yield LecturerEntity_1.Lecturer.findOne({ where: { id: lect.id } });
                    if (lecturer == null) {
                        response.status(404).json(`Přednášející s ID "${lect.id}" nexistuje!`);
                        return;
                    }
                    lecturers.push(lecturer);
                }
                var unit = UnitEntity_1.Unit.create({
                    type: request.body.type,
                    requiredCapacity: request.body.requiredCapacity,
                    duration: request.body.duration,
                    periodic: request.body.periodic,
                    compulsory: request.body.compulsory,
                    frozen: request.body.frozen,
                    weeks: request.body.weeks,
                    day: request.body.day,
                    startTime: request.body.startTime,
                    subject: subject,
                    room: room,
                    lecturers: lecturers
                });
                yield unit.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Lekce úspěšně přidána.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static updateUnit(request, response) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unit = yield UnitEntity_1.Unit.findOne({ where: { id: request.params.id } });
                if (unit == null) {
                    response.status(404).json(`Lekce s ID "${request.params.id}" neexistuje!`);
                    return;
                }
                unit.type = (_a = request.body.type) !== null && _a !== void 0 ? _a : unit.type;
                unit.requiredCapacity = (_b = request.body.requiredCapacity) !== null && _b !== void 0 ? _b : unit.requiredCapacity;
                unit.duration = (_c = request.body.duration) !== null && _c !== void 0 ? _c : unit.duration;
                unit.periodic = (_d = request.body.periodic) !== null && _d !== void 0 ? _d : unit.periodic;
                unit.compulsory = (_e = request.body.compulsory) !== null && _e !== void 0 ? _e : unit.compulsory;
                unit.frozen = (_f = request.body.frozen) !== null && _f !== void 0 ? _f : unit.frozen;
                unit.weeks = (_g = request.body.weeks) !== null && _g !== void 0 ? _g : unit.weeks;
                unit.day = (_h = request.body.day) !== null && _h !== void 0 ? _h : unit.day;
                unit.startTime = (_j = request.body.startTime) !== null && _j !== void 0 ? _j : unit.startTime;
                if (request.body.subjectAbbreviation != undefined) {
                    var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: request.body.subjectAbbreviation } });
                    if (subject == null) {
                        response.status(404).json(`Předmět se zkratkou "${request.body.subjectAbbreviation}" nexistuje!`);
                        return;
                    }
                    unit.subject = subject !== null && subject !== void 0 ? subject : unit.subject;
                }
                if (request.body.lecturers != undefined) {
                    var lecturers = [];
                    for (var lect of request.body.lecturers) {
                        const lecturer = yield LecturerEntity_1.Lecturer.findOne({ where: { id: lect.id } });
                        if (lecturer == null) {
                            response.status(404).json(`Přednášející s ID "${lect.id}" nexistuje!`);
                            return;
                        }
                        lecturers.push(lecturer);
                    }
                    unit.lecturers = lecturers !== null && lecturers !== void 0 ? lecturers : unit.lecturers;
                }
                yield unit.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Lekce s ID "${request.params.id}" úspěšně upravena.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static deleteUnit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var unit = yield UnitEntity_1.Unit.findOne({ where: { id: request.params.id } });
                if (unit == null) {
                    response.status(404).json(`Lekce s ID "${request.params.id}" neexistuje!`);
                    return;
                }
                var sharedStudents = yield SharedStudentsEntity_1.SharedStudents.find({
                    where: [
                        { unitA: { id: unit.id } },
                        { unitB: { id: unit.id } },
                    ]
                });
                for (var sharedStudent of sharedStudents) {
                    yield sharedStudent.remove();
                }
                yield unit.remove();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Lekce s ID "${request.params.id}" úspěšně smazána.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.UnitController = UnitController;
