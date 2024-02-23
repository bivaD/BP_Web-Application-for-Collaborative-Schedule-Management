"use strict";
/**
 * @file RoomsController.ts
 * @description This file is controller for rooms.
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
exports.RoomsController = void 0;
const typeorm_1 = require("typeorm");
const RoomEntity_1 = require("../database/RoomEntity");
const SuitableRoomEntity_1 = require("../database/SuitableRoomEntity");
class RoomsController {
    static getAllRooms(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield RoomEntity_1.Room.find({ where: { name: typeorm_1.Not('unsorted') } });
                response.json(rooms);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getOneRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var room = yield RoomEntity_1.Room.findOne({ where: { name: request.params.name } });
                if (room == null) {
                    response.status(404).json(`Místnost "${request.params.name}" neexistuje!`);
                    return;
                }
                response.json(room);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var room = yield RoomEntity_1.Room.findOne({ where: { name: request.body.name } });
                if (room != null) {
                    response.status(409).json(`Místnost se jménem "${request.body.name}" již existuje!`);
                    return;
                }
                room = RoomEntity_1.Room.create({
                    name: request.body.name,
                    capacity: request.body.capacity,
                    reservedHours: request.body.reservedHours
                });
                yield room.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Místnost "${request.body.name}" úspěšně přidána.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static updateRoom(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var room = yield RoomEntity_1.Room.findOne({ where: { name: request.params.name } });
                if (room == null) {
                    response.status(409).json(`Místnost se jménem "${request.params.name}" již existuje!`);
                    return;
                }
                room.capacity = (_a = request.body.capacity) !== null && _a !== void 0 ? _a : room.capacity;
                room.reservedHours = (_b = request.body.reservedHours) !== null && _b !== void 0 ? _b : room.reservedHours;
                yield room.save();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Místnost "${request.params.name}" úspěšně upravena.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static deleteRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var room = yield RoomEntity_1.Room.findOne({ where: { name: request.params.name }, relations: { units: true, suitableRoom: true } });
                if (room == null) {
                    response.status(404).json(`Místnost "${request.params.name}" neexistuje!`);
                    return;
                }
                for (var sr of room.suitableRoom) {
                    var suitableroom = yield SuitableRoomEntity_1.SuitableRoom.findOne({
                        where: { id: sr.id },
                    });
                    if (suitableroom == null) {
                        response.status(404).json(`Vhodná místnost s ID": ${request.body.id} neexistuje!`);
                        return;
                    }
                    yield suitableroom.remove();
                }
                for (var unit of room.units) {
                    var unitRoom = yield RoomEntity_1.Room.findOne({ where: { name: 'unsorted' } });
                    if (unitRoom == null) {
                        response.status(404).json(`V systému chybí defaultní místnost!`);
                        return;
                    }
                    unit.room = unitRoom;
                    yield unit.save();
                }
                yield room.remove();
                const manager = request.app.get('manager');
                manager.dataUpdated();
                response.status(200).json(`Místnost "${request.params.name}" úspěšně smazána.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.RoomsController = RoomsController;
