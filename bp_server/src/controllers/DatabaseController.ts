/**
 * @file DatabaseController.ts
 * @description This file is controller for importing and exporting data.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { Lecturer } from "../database/LecturerEntity";
import { Room } from "../database/RoomEntity";
import { Settings } from "../database/SettingsEntity";
import { SharedStudents } from "../database/SharedStudentsEntity";
import { Subject } from "../database/SubjectEntity";
import { SuitableRoom } from "../database/SuitableRoomEntity";
import { Unit } from "../database/UnitEntity";
import { IDatabaseData } from "../interfaces/DatabaseExportBE";
import { EditorActionManager } from "../models/EditorActionManager";

export class DatabaseController {
    static async exportData(request: Request, response: Response) {
        try {
            const database: IDatabaseData = {
                settings: await Settings.find(),

                rooms: await Room.find(),
                subjects: await Subject.find(),
                lecturers: await Lecturer.find(),
                units: await Unit.find({
                    relations: {
                        room: true,
                        subject: true,
                        lecturers: true
                    }
                }),
                sharedStudents: await SharedStudents.find({
                    relations: {
                        unitA: true,
                        unitB: true
                    }
                }),
                suitableRooms: await SuitableRoom.find({
                    relations: {
                        room: true,
                        subject: true
                    }
                })
            }
            response.json(database);
        } catch (error) {
            console.log(error);
        }
    }

    private static checkNumber(numberToCheck: number, min?: number, max?: number): string {
        const minValue: number = min ?? -999999999;
        const maxValue: number = max ?? 999999999;
        if (!Number.isInteger(numberToCheck)) {
            return `Hodnota musí být celé číslo`;
        } else if (minValue > numberToCheck) {
            return `Hodnota musí být ${minValue} nebo vyšší.`;
        } else if (maxValue < numberToCheck) {
            return `Hodnota musí být ${maxValue} nebo nižší.`;
        } else {
            return '';
        }
    }

    private static checkBoolean(valueToCheck: boolean): string {
        if ((typeof valueToCheck) != 'boolean') {
            return `Hodnota musí být typu boolean`;
        } else {
            return '';
        }
    }

    private static checkString(stringToCheck: string, voluntary: boolean = false, maxLenght: number = 255): string {
        const minLenght: number = 3;
        if (typeof stringToCheck == 'string') {
            var currentValue: string = (stringToCheck.trim());
        } else {
            return `${typeof stringToCheck} se vydává za řetězec - ve vstupních datech je špatný typ nebo některý z údajů chybí. \n`
        }
        if (!voluntary) {
            if (currentValue.length < minLenght || currentValue.length > maxLenght) {
                return `Hodnota musí být delší než ${minLenght} a kratší než ${maxLenght} znaků. \n`;
            } else if (!(/^[\-a-zA-Z\s0-9./,_À-ʼ]+$/.test(currentValue))) {
                return `Hodnota může obsahovat pouze alfanumerické znaky až na některé výjimky, např.: .-/,_ \n`;
            } else {
                return '';
            }
        } else {
            if (currentValue == undefined) {
                currentValue = '';
            }
            if (currentValue.length == 0) {
                return '';
            } else if (currentValue.length < minLenght || currentValue.length > maxLenght) {
                return `Hodnota může být prázdná nebo delší než ${minLenght} a kratší než ${maxLenght} znaků. \n`;
            } else if (!(/^[\-a-zA-Z\s0-9./,_À-ʼ]+$/.test(currentValue))) {
                return `Hodnota může být prázdná nebo obsahovat pouze alfanumerické znaky až na některé výjimky, např.: .-/,_ \n`;
            } else {
                return '';
            }
        }
    }

    static async importSettings(settings: Settings): Promise<string> {
        try {
            var msg: string = this.checkString(settings.name);
            if (msg != '') {
                return `Nepodařilo se přidat nastavení ${settings.name}: ${settings.name} není validní hodnota atributu nastavení name: ${msg}`;
            }
            if (typeof settings.value != 'string') {
                return `Nepodařilo se přidat nastavení ${settings.name}: ${settings.value} není validní hodnota atributu nastavení value.`;
            }
            settings = Settings.create({
                name: settings.name,
                value: settings.value
            });
            await settings.save();
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se přidat nastavení ${settings.name}.\n`;
        }
    }
    static async importRoom(room: Room): Promise<string> {
        try {
            var msg: string = this.checkString(room.name);
            if (msg != '') {
                return `Nepodařilo se přidat místnost ${room.name}: ${room.name} není validní hodnota atributu místnosti name: ${msg}`;
            }
            msg = this.checkNumber(room.capacity, 0);
            if (msg != '') {
                return `Nepodařilo se přidat místnost ${room.name}: ${room.capacity} není validní hodnota atributu místnosti capacity: ${msg}`;
            }
            if (room.name != 'unsorted') {
                var r: Room = Room.create(room);
                await r.save();
            }
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se přidat místnost ${room.name}.\n`;
        }
    }

    static async importSubject(subject: Subject): Promise<string> {
        var msg: string = this.checkString(subject.name);
        if (msg != '') {
            return `Nepodařilo se přidat předmět ${subject.abbreviation}: ${subject.name} není validní hodnota atributu předmětu name: ${msg}`;
        }
        msg = this.checkString(subject.abbreviation);
        if (msg != '') {
            return `Nepodařilo se přidat předmět ${subject.abbreviation}: ${subject.abbreviation} není validní hodnota atributu předmětu abbreviation: ${msg}`;
        }
        try {
            var s: Subject = Subject.create(subject);
            await s.save();
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se přidat předmět ${subject.abbreviation}.\n`;
        }
    }
    static async importLecturer(lecturer: Lecturer): Promise<string> {
        var msg: string = this.checkString(lecturer.name);
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
            var l: Lecturer = Lecturer.create(lecturer);
            await l.save();
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se přidat přednášejícího ${lecturer.name}:\n`;
        }
    }
    static async importUnit(unit: Unit): Promise<string> {
        var msg: string = this.checkString(unit.id);
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
                var subject: Subject | null = await Subject.findOne({ where: { abbreviation: unit.subject.abbreviation } });
                if (subject == null) {
                    return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: Předmět se zkratkou "${unit.subject.abbreviation}" nexistuje.`;
                }
            } else {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}`;
            }

            if (typeof unit.room == 'object') {
                var room: Room | null = await Room.findOne({ where: { name: unit.room.name } });
                if (room == null) {
                    return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}: Místnost s názvem "${unit.room.name}" nexistuje.`;
                }
            } else {
                return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}`;
            }
            var lecturers: Lecturer[] = [];
            for (var lect of unit.lecturers) {
                if (typeof lect == 'object') {
                    const lecturer: Lecturer | null = await Lecturer.findOne({ where: { id: lect.id } });
                    if (lecturer == null) {
                        return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}:  Přednášející s ID "${lect.id}" nexistuje!`;
                    }
                    lecturers.push(lecturer);
                } else {
                    return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}`;
                }
            }

            var unit: Unit = Unit.create(unit);
            await unit.save();
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se přidat lekci s identifikátorem ${unit.id}.\n`;
        }
    }
    static async importSharedStudents(sharedStudents: SharedStudents): Promise<string> {
        
        var msg: string = this.checkString(sharedStudents.id);
        if (msg != '') {
            return `Nepodařilo se přidat sdílené studenty s identifikátorem ${sharedStudents.id}: ${sharedStudents.id} není validní hodnota atributu sdílených studentů id: ${msg}`;
        }
        msg = this.checkNumber(sharedStudents.count, 0);
        if (msg != '') {
            return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}: ${sharedStudents.count} není validní hodnota atributu sdílených studentů count: ${msg}`;
        }
        try {
            if (typeof sharedStudents.unitA == 'object') {
                var u: Unit | null = await Unit.findOne({ where: { id: sharedStudents.unitA.id } });
                if (u == null) {
                    return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}:  Lekce s identifikátorem "${sharedStudents.unitA.id}" nexistuje.`;
                }
            } else {
                return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}: `;
            }

            if (typeof sharedStudents.unitB == 'object') {
                var u: Unit | null = await Unit.findOne({ where: { id: sharedStudents.unitB.id } });
                if (u == null) {
                    return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}:  Lekce s identifikátorem "${sharedStudents.unitB.id}" nexistuje.`;
                }
            } else {
                return `Nepodařilo se přidat sdílené studenty  s identifikátorem ${sharedStudents.id}: `;
            }

            var ss: SharedStudents = SharedStudents.create(sharedStudents);
            await ss.save();
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se pridat společné studenty s identifikátorem ${sharedStudents.id}.\n`;
        }
    }
    static async importSuitableRoom(suitableRoom: SuitableRoom): Promise<string> {
        var msg: string = this.checkString(suitableRoom.id);
        if (msg != '') {
            return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: ${suitableRoom.id} není validní hodnota atributu vhodné místnosti id: ${msg}`;
        }
        msg = this.checkNumber(suitableRoom.unitType, 0, 6);
        if (msg != '') {
            return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: ${suitableRoom.unitType} není validní hodnota atributu vhodné místnosti unitType: ${msg}`;
        }
        try {
            if (typeof suitableRoom.subject == 'object') {
                var subject: Subject | null = await Subject.findOne({ where: { abbreviation: suitableRoom.subject.abbreviation } });
                if (subject == null) {
                    return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: Předmět se zkratkou "${suitableRoom.subject.abbreviation}" nexistuje.`;
                }
            } else {
                return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}`;
            }

            if (typeof suitableRoom.room == 'object') {
                var room: Room | null = await Room.findOne({ where: { name: suitableRoom.room.name } });
                if (room == null) {
                    return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}: Místnost s názvem "${suitableRoom.room.name}" nexistuje.`;
                }
            } else {
                return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}`;
            }
            var sr: SuitableRoom = SuitableRoom.create(suitableRoom);
            await sr.save();
            return '';
        } catch (error) {
            console.log(error);
            return `Nepodařilo se přidat záznam o vhodné místnosti s identifikátorem ${suitableRoom.id}.\n`;
        }
    }


    static async importData(request: Request, response: Response) {
        try {
            var data: IDatabaseData = request.body.data;
            var msg: string = '';
            if (msg !== '') {
                response.status(409).json(msg);
            } else {
                var msg: string = '';
                for (var settings of data.settings) {
                    msg += await this.importSettings(settings);
                }
                for (var room of data.rooms) {
                    msg += await this.importRoom(room);
                }
                for (var subject of data.subjects) {
                    msg += await this.importSubject(subject);
                }
                for (var lecturer of data.lecturers) {
                    msg += await this.importLecturer(lecturer);
                }
                for (var unit of data.units) {
                    msg += await this.importUnit(unit);
                }
                for (var sharedStudents of data.sharedStudents) {
                    msg += await this.importSharedStudents(sharedStudents);
                }
                for (var suitableRoom of data.suitableRooms) {
                    msg += await this.importSuitableRoom(suitableRoom);
                }
                if (msg !== '') {
                    response.status(409).json(msg);
                }
                const manager: EditorActionManager = request.app.get('manager');
                manager.dataUpdated();
                response.json('Vše importováno, žádné nalezené chyby.');
                return;
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }
}
