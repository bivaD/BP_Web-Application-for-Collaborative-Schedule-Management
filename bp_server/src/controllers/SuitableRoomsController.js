"use strict";
/**
 * @file SuitableRoomsController.ts
 * @description This file is controller for suitable rooms.
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
exports.SuitableRoomController = void 0;
const SuitableRoomEntity_1 = require("../database/SuitableRoomEntity");
const dataTypesBE_1 = require("../interfaces/dataTypesBE");
class SuitableRoomController {
    static getAllSuitableRooms(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.json(yield SuitableRoomEntity_1.SuitableRoom.find({
                    relations: {
                        subject: true,
                        room: true
                    },
                    order: {
                        subject: { abbreviation: 'ASC' },
                        unitType: 'ASC'
                    }
                }));
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getAllSuitableRoomsNamesForUnit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const suitableRooms = yield SuitableRoomEntity_1.SuitableRoom.find({
                    where: {
                        subject: { abbreviation: request.params.abbreviation },
                        unitType: parseInt(request.params.unitType),
                    }, relations: {
                        room: true
                    }
                });
                var result = [];
                for (var sr of suitableRooms) {
                    result.push(sr.room.name);
                }
                response.json(result);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addSuitableRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var suitableroom = yield SuitableRoomEntity_1.SuitableRoom.findOne({
                    where: {
                        subject: { abbreviation: request.body.subject },
                        unitType: request.body.unitType,
                        room: { name: request.body.room }
                    }
                });
                if (suitableroom != null) {
                    response.status(409).json(`Místnost ${request.body.room} je již uvedena jako vhodná pro ${request.body.subject} - ${request.body.unitType}`);
                    return;
                }
                suitableroom = SuitableRoomEntity_1.SuitableRoom.create({
                    subject: request.body.subject,
                    unitType: request.body.unitType,
                    room: request.body.room
                });
                yield suitableroom.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Místnost ${request.body.room} pro ${request.body.subject} - ${dataTypesBE_1.UnitType[request.body.unitType]} úspěšně přidána.`);
            }
            catch (error) {
                console.log(error);
                response.status(409).json(`Nepodařilo se přidat vhodnou místnost!`);
            }
        });
    }
    static deleteSuitableRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var suitableroom = yield SuitableRoomEntity_1.SuitableRoom.findOne({
                    where: { id: request.params.id },
                    relations: { room: true, subject: true }
                });
                if (suitableroom == null) {
                    response.status(404).json(`Vhodná místnost s ID": ${request.body.id} neexistuje!`);
                    return;
                }
                yield suitableroom.remove();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Místnost ${suitableroom.room.name} pro ${suitableroom.subject.abbreviation} - ${dataTypesBE_1.UnitType[suitableroom.unitType]} úspěšně smazána.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.SuitableRoomController = SuitableRoomController;
