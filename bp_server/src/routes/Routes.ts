/**
 * @file Routes.ts
 * @description In this file is mapping routes to controllers.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Router } from 'express';
import { CollisionsController } from '../controllers/CollisionsController';
import { DatabaseController } from '../controllers/DatabaseController';
import { LecturerController } from '../controllers/LecturersController';
import { RoomsController } from '../controllers/RoomsController';
import { SettingsController } from '../controllers/SettingsController';
import { SubjectsController } from '../controllers/SubjectsController';
import { SuitableRoomController } from '../controllers/SuitableRoomsController';
import { TimetablesController } from '../controllers/TimetableController';
import { UnitController } from '../controllers/UnitsController';
export default class Routes {
    public static async defineRoutes(router: Router) {
        this.defineHomeRoutes(router);
        this.defineLecturerRoutes(router);
        this.defineRoomsRoutes(router);
        this.defineUnitsRoutes(router);
        this.defineSubjectsRoutes(router);
        this.defineSettingsRoutes(router);
        this.defineSuitableRoomRoutes(router);
        this.defineCollisionsRoutes(router);
        this.defineDatabaseRoutes(router);
    }

    private static defineHomeRoutes(router: Router) {
        router.get('/', (request, response) => { response.redirect('/home'); });
        router.get('/home', (request, response) => { response.json({ message: 'Sweet home Alabama!' }); });
    }

    private static async defineRoomsRoutes(router: Router) {
        const base = '/rooms';
        router.get(base + '/table', async (request, response) => {await RoomsController.getAllRooms(request, response)});
        router.get(base + '/timetables', async (request, response) => {await TimetablesController.getAllRoomTimetables(request, response)});
        router.get(base + '/:name', async (request, response) => {await RoomsController.getOneRoom(request, response)});

        router.post(base, async (request, response) => {await RoomsController.addRoom(request, response)});
        router.put(base + '/:name', async (request, response) => {await RoomsController.updateRoom(request, response)});
        router.delete(base + '/:name', async (request, response) => {await RoomsController.deleteRoom(request, response)});
    }

    private static async defineUnitsRoutes(router: Router) {
        const base = '/units';
        router.get(base, async (request, response) => {await UnitController.getAllUnits(request, response)});
        router.get(base + '/byLecturer/:id', async (request, response) => {await UnitController.getAllUnitsByLecturer(request, response)});
        router.get(base + '/byRoom/:name', async (request, response) => {await UnitController.getAllUnitsByRoom(request, response)});
        router.get(base + '/bySubject/:abbreviation', async (request, response) => {await UnitController.getAllUnitsBySubject(request, response)});
        router.get(base + '/studentsTable', async (request, response) => {await UnitController.getAllStudents(request, response)});
        router.get(base + '/unsorted', async (request, response) => {await UnitController.getAllUnsortedUnits(request, response)});
        router.get(base + '/:id', async (request, response) => {await UnitController.getOneUnit(request, response)});

        router.post(base, async (request, response) => {await UnitController.addUnit(request, response)});
        router.post(base + '/sharedStudents', async (request, response) => {await UnitController.addSharedStudents(request, response)});
        router.put(base + '/:id', async (request, response) => {await UnitController.updateUnit(request, response)});
        router.delete(base + '/:id', async (request, response) => {await UnitController.deleteUnit(request, response)});
    }

    private static async defineSubjectsRoutes(router: Router) {
        const base = '/subjects';
        router.get(base + '/table', async (request, response) => {await SubjectsController.getAllSubjects(request, response)});
        router.get(base + '/:abbreviation', async (request, response) => {await SubjectsController.getOneSubject(request, response)});

        router.post(base, async (request, response) => {await SubjectsController.addSubject(request, response)});
        router.put(base + '/:abbreviation', async (request, response) => {await SubjectsController.updateSubject(request, response)});
        router.delete(base + '/:abbreviation', async (request, response) => {await SubjectsController.deleteSubject(request, response)});
    }

    private static async defineLecturerRoutes(router: Router) {
        const base = '/lecturers';
        router.get(base, async (request, response) => {await LecturerController.getAllLecturers(request, response)});
        router.get(base + '/:id', async (request, response) => {await LecturerController.getOneLecturer(request, response)});
        router.get(base + '/bySubject/:abbreviation', async (request, response) => {await LecturerController.getAllLecturersBySubject(request, response)});

        router.post(base, async (request, response) => {await LecturerController.addLecturer(request, response)});
        router.put(base + '/:id', async (request, response) => {await LecturerController.updateLecturer(request, response)});
        router.delete(base + '/:id', async (request, response) => {await LecturerController.deleteLecturer(request, response)});
    }

    private static async defineSettingsRoutes(router: Router) {
        const base = '/settings';
        router.get(base, async (request, response) => {await SettingsController.getAllSettings(request, response)});
        router.get(base + '/:name', async (request, response) => {await SettingsController.getOneSettings(request, response)});
        
        router.post(base, async (request, response) => {await SettingsController.addSettings(request, response)});
        router.put(base, async (request, response) => {await SettingsController.updateSettings(request, response)});
    }

    private static async defineSuitableRoomRoutes(router: Router){
        const base = '/suitableRooms';
        
        router.get(base, async (request, response) => {await SuitableRoomController.getAllSuitableRooms(request, response)});
        router.get(base + '/:abbreviation/:unitType', async (request, response) => {await SuitableRoomController.getAllSuitableRoomsNamesForUnit(request, response)});
        router.post(base, async (request, response) => {await SuitableRoomController.addSuitableRoom(request, response)});
        router.delete(base + '/:id', async (request, response) => {await SuitableRoomController.deleteSuitableRoom(request, response)});
    }
    private static async defineCollisionsRoutes(router: Router){
        const base = '/collisions';
        router.get(base, async (request, response) => {await CollisionsController.getAllCollisions(request, response)});
    }
    private static async defineDatabaseRoutes(router: Router){
        const base = '/database';
        router.get(base, async (request, response) => {await DatabaseController.exportData(request, response)});
        router.post(base, async (request, response) => {await DatabaseController.importData(request, response)});
    }
}