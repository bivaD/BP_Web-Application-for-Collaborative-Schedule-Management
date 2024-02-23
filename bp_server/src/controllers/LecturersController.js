"use strict";
/**
 * @file LecturersController.ts
 * @description This file is controller for lecturers.
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
exports.LecturerController = void 0;
const LecturerEntity_1 = require("../database/LecturerEntity");
const UnitEntity_1 = require("../database/UnitEntity");
class LecturerController {
    static getAllLecturers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.json(yield LecturerEntity_1.Lecturer.find());
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllLecturersBySubject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lecturersBySubject = [];
                var units = yield UnitEntity_1.Unit.find({
                    relations: {
                        subject: true,
                        lecturers: true
                    }
                });
                for (var unit of units) {
                    if (unit.subject.abbreviation == request.params.abbreviation) {
                        for (var lecturer of unit.lecturers) {
                            var index = lecturersBySubject.findIndex((alreadAddedLecturer) => { return alreadAddedLecturer.id == lecturer.id; });
                            if (index == -1) {
                                lecturersBySubject.push(lecturer);
                            }
                        }
                    }
                }
                response.json(lecturersBySubject);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getOneLecturer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lecturer = yield LecturerEntity_1.Lecturer.findOne({ where: { id: request.params.id } });
                if (lecturer == null) {
                    response.status(404).json(`Přednášející s ID ${request.params.id} neexistuje!`);
                    return;
                }
                response.json(lecturer);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addLecturer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lecturer = LecturerEntity_1.Lecturer.create({
                    name: request.body.name,
                    surname: request.body.surname,
                    titlesBefore: request.body.titlesBefore,
                    titlesAfter: request.body.titlesAfter,
                    timePriorities: request.body.timePriorities
                });
                yield lecturer.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Přednášející úspěšně přidán.`);
            }
            catch (error) {
                console.log(error);
                response.status(409).json(`Nepodařilo se přidat přednášejícího!`);
            }
        });
    }
    static updateLecturer(request, response) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lecturer = yield LecturerEntity_1.Lecturer.findOne({ where: { id: request.params.id } });
                if (lecturer == null) {
                    response.status(404).json(`Přednášející s ID ${request.params.id} neexistuje!`);
                    return;
                }
                lecturer.name = (_a = request.body.name) !== null && _a !== void 0 ? _a : lecturer.name;
                lecturer.surname = (_b = request.body.surname) !== null && _b !== void 0 ? _b : lecturer.surname;
                lecturer.titlesBefore = (_c = request.body.titlesBefore) !== null && _c !== void 0 ? _c : lecturer.titlesBefore;
                lecturer.titlesAfter = (_d = request.body.titlesAfter) !== null && _d !== void 0 ? _d : lecturer.titlesAfter;
                lecturer.timePriorities = (_e = request.body.timePriorities) !== null && _e !== void 0 ? _e : lecturer.timePriorities;
                yield lecturer.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Přednášející s ID ${request.params.id} úspěšně upraven.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static deleteLecturer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lecturer = yield LecturerEntity_1.Lecturer.findOne({ where: { id: request.params.id } });
                if (lecturer == null) {
                    response.status(404).json(`Přednášející s ID ${request.params.id} neexistuje!`);
                    return;
                }
                yield lecturer.remove();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Přednášející s ID ${request.params.id} úspěšně smazán.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.LecturerController = LecturerController;
