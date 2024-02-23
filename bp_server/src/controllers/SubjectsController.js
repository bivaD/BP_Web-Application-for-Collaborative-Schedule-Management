"use strict";
/**
 * @file SubjectsController.ts
 * @description This file is controller for subjects.
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
exports.SubjectsController = void 0;
const SharedStudentsEntity_1 = require("../database/SharedStudentsEntity");
const SubjectEntity_1 = require("../database/SubjectEntity");
const SuitableRoomEntity_1 = require("../database/SuitableRoomEntity");
class SubjectsController {
    static getAllSubjects(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var subjects = yield SubjectEntity_1.Subject.find({ relations: {
                        units: true
                    } });
                var subjectsApi = [];
                for (var subject of subjects) {
                    var subjectApi = {
                        abbreviation: subject.abbreviation,
                        name: subject.name,
                        unitCount: subject.units.length
                    };
                    subjectsApi.push(subjectApi);
                }
                response.json(subjectsApi);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getOneSubject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: request.params.abbreviation } });
                if (subject == null) {
                    response.status(404).json(`Předmět "${request.params.abbreviation}" neexistuje!`);
                    return;
                }
                response.json(subject);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addSubject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: request.body.abbreviation } });
                if (subject != null) {
                    response.status(409).json(`Předmět s názvem "${request.body.abbreviation}" již existuje!`);
                    return;
                }
                subject = SubjectEntity_1.Subject.create({
                    abbreviation: request.body.abbreviation,
                    name: request.body.name,
                });
                yield subject.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Předmět "${request.body.abbreviation}" úspěšně přidán.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static updateSubject(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: request.params.abbreviation } });
                if (subject == null) {
                    response.status(404).json(`Předmět s názvem "${request.params.abbreviation}" neexistuje!`);
                    return;
                }
                subject.name = (_a = request.body.name) !== null && _a !== void 0 ? _a : subject.name;
                yield subject.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Předmět "${request.params.abbreviation}" úspěšně upraven.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static deleteSubject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var subject = yield SubjectEntity_1.Subject.findOne({ where: { abbreviation: request.params.abbreviation }, relations: { suitableRoom: true, units: true } });
                if (subject == null) {
                    response.status(404).json(`Předmět "${request.params.abbreviation}" neexistuje!`);
                    return;
                }
                for (var sr of subject.suitableRoom) {
                    var suitableroom = yield SuitableRoomEntity_1.SuitableRoom.findOne({
                        where: { id: sr.id },
                    });
                    if (suitableroom == null) {
                        response.status(404).json(`Vhodná místnost s ID": ${request.body.id} neexistuje!`);
                        return;
                    }
                    yield suitableroom.remove();
                }
                for (var unit of subject.units) {
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
                }
                yield subject.remove();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Předmět "${request.params.abbreviation}" úspěšně smazán.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.SubjectsController = SubjectsController;
