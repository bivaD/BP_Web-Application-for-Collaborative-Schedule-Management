/**
 * @file RoomsController.ts
 * @description This file is controller for rooms.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { Not } from "typeorm";
import { Room } from "../database/RoomEntity";
import { SuitableRoom } from "../database/SuitableRoomEntity";
import { EditorActionManager } from "../models/EditorActionManager";

export class RoomsController {
    static async getAllRooms(request: Request, response: Response) {
        try {
            const rooms: Room[] = await Room.find({where: {name: Not('unsorted')}});
            response.json(rooms);
        } catch (error) {
            console.log(error);
        }
    }
    static async getOneRoom(request: Request, response: Response) {
        try {
            var room: Room | null = await Room.findOne({where: {name: request.params.name}})
            if(room == null){
                response.status(404).json(`Místnost "${request.params.name}" neexistuje!`);
                return;
            }
            response.json(room);
        } catch (error) {
            console.log(error);
        }    
    }
    static async addRoom(request: Request, response: Response) {
        try {
            var room: Room | null = await Room.findOne({where: {name: request.body.name}})
            if(room != null){
                response.status(409).json(`Místnost se jménem "${request.body.name}" již existuje!`);
                return;
            }
            room = Room.create({
                name: request.body.name,
                capacity: request.body.capacity,
                reservedHours: request.body.reservedHours
            });
            await room.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Místnost "${request.body.name}" úspěšně přidána.`);
        } catch (error) {
            console.log(error);
        }    
    }

    static async updateRoom(request: Request, response: Response) {
        try {
            var room: Room | null = await Room.findOne({where: {name: request.params.name}})
            if (room == null) {
                response.status(409).json(`Místnost se jménem "${request.params.name}" již existuje!`);
                return;
            }
            room.capacity = request.body.capacity ?? room.capacity;
            room.reservedHours = request.body.reservedHours ?? room.reservedHours
            await room.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Místnost "${request.params.name}" úspěšně upravena.`);
        } catch (error) {
            console.log(error);
        }    
    }

    static async deleteRoom(request: Request, response: Response) {
        try {
            var room: Room | null = await Room.findOne({where: {name: request.params.name}, relations: {units: true, suitableRoom: true}})
            if(room == null){
                response.status(404).json(`Místnost "${request.params.name}" neexistuje!`);
                return;
            }
            for(var sr of room.suitableRoom){
                var suitableroom: SuitableRoom | null = await SuitableRoom.findOne({
                    where: { id: sr.id },
                })
                if (suitableroom == null) {
                    response.status(404).json(`Vhodná místnost s ID": ${request.body.id} neexistuje!`);
                    return;
                }
                await suitableroom.remove();
            }

            for(var unit of room.units){
                var unitRoom: Room | null = await Room.findOne({ where: { name: 'unsorted' } });
                if (unitRoom == null) {
                    response.status(404).json(`V systému chybí defaultní místnost!`);
                    return;
                }
                unit.room = unitRoom;
                await unit.save();
            }

            await room.remove();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Místnost "${request.params.name}" úspěšně smazána.`);
        } catch (error) {
            console.log(error);
        }    
    }
}
