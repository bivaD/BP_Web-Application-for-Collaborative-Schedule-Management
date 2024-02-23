"use strict";
/**
 * @file DatabaseController.ts
 * @description This file is controller for importing and exporting data.
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
exports.DatabaseController = void 0;
const LecturerEntity_1 = require("../database/LecturerEntity");
const RoomEntity_1 = require("../database/RoomEntity");
const SettingsEntity_1 = require("../database/SettingsEntity");
const SharedStudentsEntity_1 = require("../database/SharedStudentsEntity");
const SubjectEntity_1 = require("../database/SubjectEntity");
const SuitableRoomEntity_1 = require("../database/SuitableRoomEntity");
const UnitEntity_1 = require("../database/UnitEntity");
class DatabaseController {
    static exportData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const database = {
                    settings: yield SettingsEntity_1.Settings.find(),
                    rooms: yield RoomEntity_1.Room.find(),
                    subjects: yield SubjectEntity_1.Subject.find(),
                    lecturers: yield LecturerEntity_1.Lecturer.find(),
                    units: yield UnitEntity_1.Unit.find({
                        relations: {
                            room: true,
                            subject: true,
                            lecturers: true
                        }
                    }),
                    sharedStudents: yield SharedStudentsEntity_1.SharedStudents.find({
                        relations: {
                            unitA: true,
                            unitB: true
                        }
                    }),
                    suitableRooms: yield SuitableRoomEntity_1.SuitableRoom.find({
                        relations: {
                            room: true,
                            subject: true
                        }
                    })
                };
                response.json(database);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static checkNumber(numberToCheck, min, max) {
        const minValue = min !== null && min !== void 0 ? min : -999999999;
        const maxValue = max !== null && max !== void 0 ? max : 999999999;
        if (!Number.isInteger(numberToCheck)) {
            return `Hodnota musí být celé číslo`;
        }
        else if (minValue > numberToCheck) {
            return `Hodnota musí být ${minValue} nebo vyšší.`;
        }
        else if (maxValue < numberToCheck) {
            return `Hodnota musí být ${maxValue} nebo nižší.`;
        }
        else {
            return '';
        }
    }
    static checkBoolean(valueToCheck) {
        if ((typeof valueToCheck) != 'boolean') {
            return `Hodnota musí být typu boolean`;
        }
        else {
            return '';
        }
    }
    static checkString(stringToCheck, voluntary = false, maxLenght = 255) {
        const minLenght = 3;
        if (typeof stringToCheck == 'string') {
            var currentValue = (stringToCheck.trim());
        }
        else {
            return `${typeof stringToCheck} se vydává za řetězec - ve vstupních datech je špatný typ nebo některý z údajů chybí. \n`;
        }
        if (!voluntary) {
            if (currentValue.length < minLenght || currentValue.length > maxLenght) {
                return `Hodnota musí být delší než ${minLenght} a kratší než ${maxLenght} znaků. \n`;
            }
            else if (!(/^[\-a-zA-Z\s0-9./,_À-ʼ]+$/.test(currentValue))) {
                return `Hodnota může obsahovat pouze alfanumerické znaky až na některé výjimky, např.: .-/,_ \n`;
            }
            else {
                return '';
            }
        }
        else {
            if (currentValue == undefined) {
                currentValue = '';
            }
            if (currentValue.length == 0) {
                return '';
            }
            else if (currentValue.length < minLenght || currentValue.length > maxLenght) {
                return `Hodnota může být prázdná nebo delší než ${minLenght} a kratší než ${maxLenght} znaků. \n`;
            }
            else if (!(/^[\-a-zA-Z\s0-9./,_À-ʼ]+$/.test(currentValue))) {
                return `Hodnota může být prázdná nebo obsahovat pouze alfanumerické znaky až na některé výjimky, např.: .-/,_ \n`;
            }
            else {
                return '';
            }
        }
    }
    static importSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var msg = this.checkString(settings.name);
                if (msg != '') {
                    return `Nepodařilo se přidat nastavení ${settings.name}: ${settings.name} není validní hodnota atributu nastavení name: ${msg}`;
                }
                if (typeof settings.value != 'string') {
                    return `Nepodařilo se přidat nastavení ${settings.name}: ${settings.value} není validní hodnota atributu nastavení value.`;
                }
                settings = SettingsEntity_1.Settings.create({
                    name: settings.name,
                    value: settings.value
                });
                yield settings.save();
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se přidat nastavení ${settings.name}.\n`;
            }
        });
    }
    static importRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var msg = this.checkString(room.name);
                if (msg != '') {
                    return `Nepodařilo se přidat místnost ${room.name}: ${room.name} není validní hodnota atributu místnosti name: ${msg}`;
                }
                msg = this.checkNumber(room.capacity, 0);
                if (msg != '') {
                    return `Nepodařilo se přidat místnost ${room.name}: ${room.capacity} není validní hodnota atributu místnosti capacity: ${msg}`;
                }
                if (room.name != 'unsorted') {
                    var r = RoomEntity_1.Room.create(room);
                    yield r.save();
                }
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se přidat místnost ${room.name}.\n`;
            }
        });
    }
    static importSubject(subject) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg = this.checkString(subject.name);
            if (msg != '') {
                return `Nepodařilo se přidat předmět ${subject.abbreviation}: ${subject.name} není validní hodnota atributu předmětu name: ${msg}`;
            }
            msg = this.checkString(subject.abbreviation);
            if (msg != '') {
                return `Nepodařilo se přidat předmět ${subject.abbreviation}: ${subject.abbreviation} není validní hodnota atributu předmětu abbreviation: ${msg}`;
            }
            try {
                var s = SubjectEntity_1.Subject.create(subject);
                yield s.save();
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se přidat předmět ${subject.abbreviation}.\n`;
            }
        });
    }
    static importLecturer(lecturer) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg = this.checkString(lecturer.name);
            if (msg != '') {
                return `Nepodařilo se přidat přednášejícího ${lecturer.name}: ${lecturer.name} není validní hodnota atributu přenášejícího name: ${msg}`;
            }
            msg = this.checkString(lecturer.surname);
            if (msg != '') {
                return `Nepodařilo se přidat přednášejícího ${lecturer.name}: ${lecturer.surname} není validní hodnota atributu přednášejícího surname: ${msg}`;
            }
            msg = this.checkString(lecturer.titlesBefore, true);
            if (msg != '') {
                return `Nepodařilo se přidat přednášejícího ${lecturer.name}: ${lecturer.titlesBefore} není validní hodnota atributu přednášejícího titlesBefore: ${msg}`;
            }
            msg = this.checkString(lecturer.titlesAfter, true);
            if (msg != '') {
                return `Nepodařilo se přidat přednášejícího ${lecturer.name}: ${lecturer.titlesAfter} není validní hodnota atributu přednášejícího titlesAfter: ${msg}`;
            }
            try {
                var l = LecturerEntity_1.Lecturer.create(lecturer);
                yield l.save();
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se přidat přednášejícího ${lecturer.name}:\n`;
            }
        });
    }
    static importUnit(unit) {
        var unit;
        return __awaiter(this, void 0, void 0, function* () {
            var msg = this.checkString(unit.id);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.id} není validní hodnota atributu lekce name: ${msg}`;
            }
            msg = this.checkNumber(unit.type, 0, 6);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.type} není validní hodnota atributu lekce type: ${msg}`;
            }
            msg = this.checkNumber(unit.requiredCapacity, 0);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.requiredCapacity} není validní hodnota atributu lekce requiredCapacity: ${msg}`;
            }
            msg = this.checkNumber(unit.duration, 0, 1440);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.duration} není validní hodnota atributu lekce duration: ${msg}`;
            }
            msg = this.checkBoolean(unit.periodic);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.periodic} není validní hodnota atributu lekce periodic: ${msg}`;
            }
            msg = this.checkBoolean(unit.compulsory);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.compulsory} není validní hodnota atributu lekce compulsory: ${msg}`;
            }
            msg = this.checkBoolean(unit.frozen);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.frozen} není validní hodnota atributu lekce frozen: ${msg}`;
            }
            msg = this.checkNumber(unit.day, 0, 7);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.day} není validní hodnota atributu lekce day: ${msg}`;
            }
            msg = this.checkNumber(unit.startTime, -1, 1440);
            if (msg != '') {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: ${unit.startTime} není validní hodnota atributu lekce startTime: ${msg}`;
            }
            try {
                if (typeof unit.subject == 'object') {
                    var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: unit.subject.abbreviation } });
                    if (subject == null) {
                        return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: Předmět se zkratkou "${unit.subject.abbreviation}" nexistuje.`;
                    }
                }
                else {
                    return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}`;
                }
                if (typeof unit.room == 'object') {
                    var room = yield RoomEntity_1.Room.findOne({ where: { name: unit.room.name } });
                    if (room == null) {
                        return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: Místnost s názvem "${unit.room.name}" nexistuje.`;
                    }
                }
                else {
                    return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}`;
                }
                var lecturers = [];
                for (var lect of unit.lecturers) {
                    if (typeof lect == 'object') {
                        const lecturer = yield LecturerEntity_1.Lecturer.findOne({ where: { id: lect.id } });
                        if (lecturer == null) {
                            return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}:  Přednášející s ID "${lect.id}" nexistuje!`;
                        }
                        lecturers.push(lecturer);
                    }
                    else {
                        return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}`;
                    }
                }
                unit = UnitEntity_1.Unit.create(unit);
                yield unit.save();
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}.\n`;
            }
        });
    }
    static importSharedStudents(sharedStudents) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg = this.checkString(sharedStudents.id);
            if (msg != '') {
                return `Nepodařilo se přidat sdílené studenty s identifikátorem ${sharedStudents.id}: ${sharedStudents.id} není validní hodnota atributu sdílených studentů id: ${msg}`;
            }
            msg = this.checkNumber(sharedStudents.count, 0);
            if (msg != '') {
                return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}: ${sharedStudents.count} není validní hodnota atributu sdílených studentů count: ${msg}`;
            }
            try {
                if (typeof sharedStudents.unitA == 'object') {
                    var u = yield UnitEntity_1.Unit.findOne({ where: { id: sharedStudents.unitA.id } });
                    if (u == null) {
                        return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}:  Lekce s identifikátorem "${sharedStudents.unitA.id}" nexistuje.`;
                    }
                }
                else {
                    return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}: `;
                }
                if (typeof sharedStudents.unitB == 'object') {
                    var u = yield UnitEntity_1.Unit.findOne({ where: { id: sharedStudents.unitB.id } });
                    if (u == null) {
                        return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}:  Lekce s identifikátorem "${sharedStudents.unitB.id}" nexistuje.`;
                    }
                }
                else {
                    return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}: `;
                }
                var ss = SharedStudentsEntity_1.SharedStudents.create(sharedStudents);
                yield ss.save();
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se pridat společné studenty s identifikátorem ${sharedStudents.id}.\n`;
            }
        });
    }
    static importSuitableRoom(suitableRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg = this.checkString(suitableRoom.id);
            if (msg != '') {
                return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: ${suitableRoom.id} není validní hodnota atributu vhodné místnosti id: ${msg}`;
            }
            msg = this.checkNumber(suitableRoom.unitType, 0, 6);
            if (msg != '') {
                return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: ${suitableRoom.unitType} není validní hodnota atributu vhodné místnosti unitType: ${msg}`;
            }
            try {
                if (typeof suitableRoom.subject == 'object') {
                    var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: suitableRoom.subject.abbreviation } });
                    if (subject == null) {
                        return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: Předmět se zkratkou "${suitableRoom.subject.abbreviation}" nexistuje.`;
                    }
                }
                else {
                    return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}`;
                }
                if (typeof suitableRoom.room == 'object') {
                    var room = yield RoomEntity_1.Room.findOne({ where: { name: suitableRoom.room.name } });
                    if (room == null) {
                        return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: Místnost s názvem "${suitableRoom.room.name}" nexistuje.`;
                    }
                }
                else {
                    return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}`;
                }
                var sr = SuitableRoomEntity_1.SuitableRoom.create(suitableRoom);
                yield sr.save();
                return '';
            }
            catch (error) {
                console.log(error);
                return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}.\n`;
            }
        });
    }
    static importData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var data = request.body.data;
                var msg = '';
                if (msg !== '') {
                    response.status(409).json(msg);
                }
                else {
                    var msg = '';
                    for (var settings of data.settings) {
                        msg += yield this.importSettings(settings);
                    }
                    for (var room of data.rooms) {
                        msg += yield this.importRoom(room);
                    }
                    for (var subject of data.subjects) {
                        msg += yield this.importSubject(subject);
                    }
                    for (var lecturer of data.lecturers) {
                        msg += yield this.importLecturer(lecturer);
                    }
                    for (var unit of data.units) {
                        msg += yield this.importUnit(unit);
                    }
                    for (var sharedStudents of data.sharedStudents) {
                        msg += yield this.importSharedStudents(sharedStudents);
                    }
                    for (var suitableRoom of data.suitableRooms) {
                        msg += yield this.importSuitableRoom(suitableRoom);
                    }
                    if (msg !== '') {
                        response.status(409).json(msg);
                    }
                    const manager = request.app.get('manager');
                    manager.dataUpdated();
                    response.json('Vše importováno, žádné nalezené chyby.');
                    return;
                }
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.DatabaseController = DatabaseController;
