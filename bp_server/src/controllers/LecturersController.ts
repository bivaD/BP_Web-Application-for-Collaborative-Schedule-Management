/**
 * @file LecturersController.ts
 * @description This file is controller for lecturers.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { Lecturer } from "../database/LecturerEntity";
import { Unit } from "../database/UnitEntity";
import { EditorActionManager } from "../models/EditorActionManager";

export class LecturerController {
    static async getAllLecturers(request: Request, response: Response) {
        try {
            response.json(await Lecturer.find());
        } catch (error) {
            console.log(error);
        }
    }
    static async getAllLecturersBySubject(request: Request, response: Response) {
        try {
            var lecturersBySubject: Lecturer[] = [];
            var units: Unit[] = await Unit.find({
                relations: {
                    subject: true,
                    lecturers: true
                }
            });
            for (var unit of units) {
                if (unit.subject.abbreviation == request.params.abbreviation) {
                    for (var lecturer of unit.lecturers) {
                        var index = lecturersBySubject.findIndex((alreadAddedLecturer) => { return alreadAddedLecturer.id == lecturer.id })
                        if (index == -1) {
                            lecturersBySubject.push(lecturer);
                        }
                    }
                }
            }
            response.json(lecturersBySubject);
        } catch (error) {
            console.log(error);
        }
    }

    static async getOneLecturer(request: Request, response: Response) {
        try {
            var lecturer: Lecturer | null = await Lecturer.findOne({ where: { id: request.params.id } })
            if (lecturer == null) {
                response.status(404).json(`Přednášející s ID ${request.params.id} neexistuje!`);
                return;
            }
            response.json(lecturer);
        } catch (error) {
            console.log(error);
        }
    }

    static async addLecturer(request: Request, response: Response) {
        try {
            var lecturer: Lecturer = Lecturer.create({
                name: request.body.name,
                surname: request.body.surname,
                titlesBefore: request.body.titlesBefore,
                titlesAfter: request.body.titlesAfter,
                timePriorities: request.body.timePriorities
            });
            await lecturer.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Přednášející úspěšně přidán.`);
        } catch (error) {
            console.log(error);
            response.status(409).json(`Nepodařilo se přidat přednášejícího!`);
        }
    }

    static async updateLecturer(request: Request, response: Response) {
        try {
            var lecturer: Lecturer | null = await Lecturer.findOne({ where: { id: request.params.id } })
            if (lecturer == null) {
                response.status(404).json(`Přednášející s ID ${request.params.id} neexistuje!`);
                return;
            }
            lecturer.name = request.body.name ?? lecturer.name;
            lecturer.surname = request.body.surname ?? lecturer.surname;
            lecturer.titlesBefore = request.body.titlesBefore ?? lecturer.titlesBefore;
            lecturer.titlesAfter = request.body.titlesAfter ?? lecturer.titlesAfter;
            lecturer.timePriorities = request.body.timePriorities ?? lecturer.timePriorities;
            await lecturer.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Přednášející s ID ${request.params.id} úspěšně upraven.`);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteLecturer(request: Request, response: Response) {
        try {
            var lecturer: Lecturer | null = await Lecturer.findOne({ where: { id: request.params.id } })
            if (lecturer == null) {
                response.status(404).json(`Přednášející s ID ${request.params.id} neexistuje!`);
                return;
            }
            await lecturer.remove();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Přednášející s ID ${request.params.id} úspěšně smazán.`);
        } catch (error) {
            console.log(error);
        }
    }
}
