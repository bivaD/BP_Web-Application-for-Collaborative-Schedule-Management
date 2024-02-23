/**
 * @file UnitsController.ts
 * @description This file is controller for units.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { Lecturer } from "../database/LecturerEntity";
import { Room } from "../database/RoomEntity";
import { SharedStudents } from "../database/SharedStudentsEntity";
import { Subject } from "../database/SubjectEntity";
import { Unit } from "../database/UnitEntity";
import { ISharedStudentsRowAPI } from "../interfaces/dataTypesBE";
import { UnitType } from "../interfaces/dataTypesBE";
import { EditorActionManager } from "../models/EditorActionManager";


export class UnitController {

    static async getAllUnits(request: Request, response: Response) {
        try {
            var units: Unit[] = await Unit.find({
                relations: {
                    subject: true,
                    room: true,
                    lecturers: true
                }
            });
            response.json(units);
        } catch (error) {
            console.log(error);
        }
    }
    static async getAllUnitsByLecturer(request: Request, response: Response) {
        try {
            var unitsByLecturer: Unit[] = [];
            var units: Unit[] = await Unit.find({
                    relations: {
                    subject: true,
                    room: true,
                    lecturers: true
                }
            });
            for(var unit of units){
                var index = unit.lecturers.findIndex((lecturer) => {return lecturer.id == request.params.id})
                if(index != -1){
                    unitsByLecturer.push(unit);
                }
            }
            response.json(unitsByLecturer);
        } catch (error) {
            console.log(error);
        }
    }
    static async getAllUnitsByRoom(request: Request, response: Response) {
        try {
            var unitsByRoom: Unit[] = [];
            var units: Unit[] = await Unit.find({
                    relations: {
                    subject: true,
                    room: true,
                    lecturers: true
                }
            });
            for(var unit of units){
                if(unit.room.name == request.params.name){
                    unitsByRoom.push(unit);
                }
            }
            response.json(unitsByRoom);
        } catch (error) {
            console.log(error);
        }
    }
    static async getAllUnitsBySubject(request: Request, response: Response) {
        try {
            var unitsBySubject: Unit[] = [];
            var units: Unit[] = await Unit.find({
                    relations: {
                    subject: true,
                    room: true,
                    lecturers: true
                }
            });
            for(var unit of units){
                if(unit.subject.abbreviation == request.params.abbreviation){
                    unitsBySubject.push(unit);
                }
            }
            response.json(unitsBySubject);
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllUnsortedUnits(request: Request, response: Response) {
        try {
            var units: Unit[] = await Unit.find()
            response.json(units);
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllStudents(request: Request, response: Response) {
        try {
            var units: Unit[] = await Unit.find({
                relations: {
                    subject: true,
                    room: true,
                    lecturers: true
                }
            });
            var sharedStudentsTable: ISharedStudentsRowAPI[] = [];
            for (var unit of units) {
                var row: ISharedStudentsRowAPI = {
                    unitId: unit.id,
                    unitName: unit.subject.abbreviation + " - " + UnitType[unit.type],
                    count: []
                }
                for (var unitB of units) {
                    if (unit.id == unitB.id) {
                        row.count.push('X');
                        continue;
                    } else {
                        const shared: SharedStudents | null = await SharedStudents.findOne({
                            where: [
                                { unitA: { id: unit.id }, unitB: { id: unitB.id } },
                                { unitB: { id: unit.id }, unitA: { id: unitB.id } },
                            ]
                        });
                        if (shared == null) {
                            row.count.push(`nezadáno`);
                        } else {
                            row.count.push(`${shared.count}`);
                        }
                    }
                }
                sharedStudentsTable.push(row);
            }
            response.json(sharedStudentsTable);
        } catch (error) {
            console.log(error);
        }
    }

    static async addSharedStudents(request: Request, response: Response) {
        try {
            var unit: Unit | null = await Unit.findOne({ where: { id: request.body.unitAId } })
            if (unit == null) {
                response.status(404).json(`Lekce s ID "${request.body.unitAId}" neexistuje!`);
                return;
            }
            var unit: Unit | null = await Unit.findOne({ where: { id: request.body.unitBId } })
            if (unit == null) {
                response.status(404).json(`Lekce s ID "${request.body.unitBId}" neexistuje!`);
                return;
            }
            var sharedStudents = SharedStudents.create({
                unitA: request.body.unitAId,
                unitB: request.body.unitBId,
                count: request.body.count
            });
            await sharedStudents.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Kolize mezi lekcemi ${request.body.unitAId} a ${request.body.unitBId} úspěšně přidána.`);
        } catch (error) {
            console.log(error);
        }
    }
    static async getOneUnit(request: Request, response: Response) {
        try {
            var unit: Unit | null = await Unit.findOne({
                where: { id: request.params.id },
                relations: {
                    subject: true,
                    room: true,
                    lecturers: true
                }
            })
            if (unit == null) {
                response.status(404).json(`Lekce s ID "${request.params.id}" neexistuje!`);
                return;
            }
            response.json(unit);
        } catch (error) {
            console.log(error);
        }
    }

    static async addUnit(request: Request, response: Response) {
        try {
            var subject: Subject | null = await Subject.findOne({ where: { abbreviation: request.body.subjectAbbreviation } });
            if (subject == null) {
                response.status(404).json(`Předmět se zkratkou "${request.body.subjectAbbreviation}" nexistuje!`);
                return;
            }
            var room: Room | null = await Room.findOne({ where: { name: 'unsorted' } });
            if (room == null) {
                response.status(404).json(`V systému chybí defaultní místnost!`);
                return;
            }
            var lecturers: Lecturer[] = [];
            for (var lect of request.body.lecturers) {
                const lecturer: Lecturer | null = await Lecturer.findOne({ where: { id: lect.id } });
                if (lecturer == null) {
                    response.status(404).json(`Přednášející s ID "${lect.id}" nexistuje!`);
                    return;
                }
                lecturers.push(lecturer);
            }
            var unit: Unit = Unit.create({
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
            await unit.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Lekce úspěšně přidána.`);
        } catch (error) {
            console.log(error);
        }
    }

    static async updateUnit(request: Request, response: Response) {
        try {
            var unit: Unit | null = await Unit.findOne({ where: { id: request.params.id } })
            if (unit == null) {
                response.status(404).json(`Lekce s ID "${request.params.id}" neexistuje!`);
                return;
            }
            unit.type = request.body.type ?? unit.type;
            unit.requiredCapacity = request.body.requiredCapacity ?? unit.requiredCapacity;
            unit.duration = request.body.duration ?? unit.duration;
            unit.periodic = request.body.periodic ?? unit.periodic
            unit.compulsory = request.body.compulsory ?? unit.compulsory;
            unit.frozen = request.body.frozen ?? unit.frozen;
            unit.weeks = request.body.weeks ?? unit.weeks;
            unit.day = request.body.day ?? unit.day;
            unit.startTime = request.body.startTime ?? unit.startTime;
            if (request.body.subjectAbbreviation != undefined) {
                var subject: Subject | null = await Subject.findOne({ where: { abbreviation: request.body.subjectAbbreviation } });
                if (subject == null) {
                    response.status(404).json(`Předmět se zkratkou "${request.body.subjectAbbreviation}" nexistuje!`);
                    return;
                }
                unit.subject = subject ?? unit.subject;
            }
            if (request.body.lecturers != undefined) {
                var lecturers: Lecturer[] = [];
                for (var lect of request.body.lecturers) {
                    const lecturer: Lecturer | null = await Lecturer.findOne({ where: { id: lect.id } });
                    if (lecturer == null) {
                        response.status(404).json(`Přednášející s ID "${lect.id}" nexistuje!`);
                        return;
                    }
                    lecturers.push(lecturer);
                }
                unit.lecturers = lecturers ?? unit.lecturers;
            }
            await unit.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Lekce s ID "${request.params.id}" úspěšně upravena.`);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteUnit(request: Request, response: Response) {
        try {
            var unit: Unit | null = await Unit.findOne({ where: { id: request.params.id } })
            if (unit == null) {
                response.status(404).json(`Lekce s ID "${request.params.id}" neexistuje!`);
                return;
            }
            var sharedStudents: SharedStudents[] = await SharedStudents.find({
                where: [
                    { unitA: { id: unit.id } },
                    { unitB: { id: unit.id } },
                ]
            });
            for(var sharedStudent of sharedStudents){
                await sharedStudent.remove();
            }            
            await unit.remove();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Lekce s ID "${request.params.id}" úspěšně smazána.`);
        } catch (error) {
            console.log(error);
        }
    }
}
