"use strict";
/**
 * @file Routes.ts
 * @description In this file is mapping routes to controllers.
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
const CollisionsController_1 = require("../controllers/CollisionsController");
const DatabaseController_1 = require("../controllers/DatabaseController");
const LecturersController_1 = require("../controllers/LecturersController");
const RoomsController_1 = require("../controllers/RoomsController");
const SettingsController_1 = require("../controllers/SettingsController");
const SubjectsController_1 = require("../controllers/SubjectsController");
const SuitableRoomsController_1 = require("../controllers/SuitableRoomsController");
const TimetableController_1 = require("../controllers/TimetableController");
const UnitsController_1 = require("../controllers/UnitsController");
class Routes {
    static defineRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            this.defineHomeRoutes(router);
            this.defineLecturerRoutes(router);
            this.defineRoomsRoutes(router);
            this.defineUnitsRoutes(router);
            this.defineSubjectsRoutes(router);
            this.defineSettingsRoutes(router);
            this.defineSuitableRoomRoutes(router);
            this.defineCollisionsRoutes(router);
            this.defineDatabaseRoutes(router);
        });
    }
    static defineHomeRoutes(router) {
        router.get('/', (request, response) => { response.redirect('/home'); });
        router.get('/home', (request, response) => { response.json({ message: 'Sweet home Alabama!' }); });
    }
    static defineRoomsRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/rooms';
            router.get(base + '/table', (request, response) => __awaiter(this, void 0, void 0, function* () { yield RoomsController_1.RoomsController.getAllRooms(request, response); }));
            router.get(base + '/timetables', (request, response) => __awaiter(this, void 0, void 0, function* () { yield TimetableController_1.TimetablesController.getAllRoomTimetables(request, response); }));
            router.get(base + '/:name', (request, response) => __awaiter(this, void 0, void 0, function* () { yield RoomsController_1.RoomsController.getOneRoom(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield RoomsController_1.RoomsController.addRoom(request, response); }));
            router.put(base + '/:name', (request, response) => __awaiter(this, void 0, void 0, function* () { yield RoomsController_1.RoomsController.updateRoom(request, response); }));
            router.delete(base + '/:name', (request, response) => __awaiter(this, void 0, void 0, function* () { yield RoomsController_1.RoomsController.deleteRoom(request, response); }));
        });
    }
    static defineUnitsRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/units';
            router.get(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getAllUnits(request, response); }));
            router.get(base + '/byLecturer/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getAllUnitsByLecturer(request, response); }));
            router.get(base + '/byRoom/:name', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getAllUnitsByRoom(request, response); }));
            router.get(base + '/bySubject/:abbreviation', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getAllUnitsBySubject(request, response); }));
            router.get(base + '/studentsTable', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getAllStudents(request, response); }));
            router.get(base + '/unsorted', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getAllUnsortedUnits(request, response); }));
            router.get(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.getOneUnit(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.addUnit(request, response); }));
            router.post(base + '/sharedStudents', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.addSharedStudents(request, response); }));
            router.put(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.updateUnit(request, response); }));
            router.delete(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield UnitsController_1.UnitController.deleteUnit(request, response); }));
        });
    }
    static defineSubjectsRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/subjects';
            router.get(base + '/table', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SubjectsController_1.SubjectsController.getAllSubjects(request, response); }));
            router.get(base + '/:abbreviation', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SubjectsController_1.SubjectsController.getOneSubject(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield SubjectsController_1.SubjectsController.addSubject(request, response); }));
            router.put(base + '/:abbreviation', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SubjectsController_1.SubjectsController.updateSubject(request, response); }));
            router.delete(base + '/:abbreviation', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SubjectsController_1.SubjectsController.deleteSubject(request, response); }));
        });
    }
    static defineLecturerRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/lecturers';
            router.get(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield LecturersController_1.LecturerController.getAllLecturers(request, response); }));
            router.get(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield LecturersController_1.LecturerController.getOneLecturer(request, response); }));
            router.get(base + '/bySubject/:abbreviation', (request, response) => __awaiter(this, void 0, void 0, function* () { yield LecturersController_1.LecturerController.getAllLecturersBySubject(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield LecturersController_1.LecturerController.addLecturer(request, response); }));
            router.put(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield LecturersController_1.LecturerController.updateLecturer(request, response); }));
            router.delete(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield LecturersController_1.LecturerController.deleteLecturer(request, response); }));
        });
    }
    static defineSettingsRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/settings';
            router.get(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield SettingsController_1.SettingsController.getAllSettings(request, response); }));
            router.get(base + '/:name', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SettingsController_1.SettingsController.getOneSettings(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield SettingsController_1.SettingsController.addSettings(request, response); }));
            router.put(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield SettingsController_1.SettingsController.updateSettings(request, response); }));
        });
    }
    static defineSuitableRoomRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/suitableRooms';
            router.get(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield SuitableRoomsController_1.SuitableRoomController.getAllSuitableRooms(request, response); }));
            router.get(base + '/:abbreviation/:unitType', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SuitableRoomsController_1.SuitableRoomController.getAllSuitableRoomsNamesForUnit(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield SuitableRoomsController_1.SuitableRoomController.addSuitableRoom(request, response); }));
            router.delete(base + '/:id', (request, response) => __awaiter(this, void 0, void 0, function* () { yield SuitableRoomsController_1.SuitableRoomController.deleteSuitableRoom(request, response); }));
        });
    }
    static defineCollisionsRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/collisions';
            router.get(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield CollisionsController_1.CollisionsController.getAllCollisions(request, response); }));
        });
    }
    static defineDatabaseRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const base = '/database';
            router.get(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield DatabaseController_1.DatabaseController.exportData(request, response); }));
            router.post(base, (request, response) => __awaiter(this, void 0, void 0, function* () { yield DatabaseController_1.DatabaseController.importData(request, response); }));
        });
    }
}
exports.default = Routes;
