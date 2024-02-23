/**
 * @file SuitableRoomsController.ts
 * @description This file is controller for suitable rooms.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { SuitableRoom } from "../database/SuitableRoomEntity";
import { UnitType } from "../interfaces/dataTypesBE";
import { EditorActionManager } from "../models/EditorActionManager";

export class SuitableRoomController {
    public static async getAllSuitableRooms(request: Request, response: Response) {
        try {
            response.json(await SuitableRoom.find({
                relations: {
                    subject: true,
                    room: true
                },
                order: {
                    subject: { abbreviation: 'ASC' },
                    unitType: 'ASC'
                }
            }));
        } catch (error) {
            console.log(error);
        }
    }

    public static async getAllSuitableRoomsNamesForUnit(request: Request, response: Response) {
        try {
            const suitableRooms: SuitableRoom[] = await SuitableRoom.find({
                where: {
                    subject: { abbreviation: request.params.abbreviation },
                    unitType: parseInt(request.params.unitType),
                }, relations: {
                    room: true
                }
            });
            var result: string[] = [];
            for(var sr of suitableRooms){
                result.push(sr.room.name);
            }
            response.json(result);
        } catch (error) {
            console.log(error);
        }
    }

    static async addSuitableRoom(request: Request, response: Response) {
        try {
            var suitableroom: SuitableRoom | null = await SuitableRoom.findOne({
                where: {
                    subject: { abbreviation: request.body.subject },
                    unitType: request.body.unitType,
                    room: { name: request.body.room }
                }
            })
            if (suitableroom != null) {
                response.status(409).json(`Místnost ${request.body.room} je již uvedena jako vhodná pro ${request.body.subject} - ${request.body.unitType}`);
                return;
            }
            suitableroom = SuitableRoom.create({
                subject: request.body.subject,
                unitType: request.body.unitType,
                room: request.body.room
            });
            await suitableroom.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Místnost ${request.body.room} pro ${request.body.subject} - ${UnitType[request.body.unitType]} úspěšně přidána.`);
        } catch (error) {
            console.log(error);
            response.status(409).json(`Nepodařilo se přidat vhodnou místnost!`);
        } 
    }

    static async deleteSuitableRoom(request: Request, response: Response) {
        try {
            var suitableroom: SuitableRoom | null = await SuitableRoom.findOne({
                where: { id: request.params.id },
                relations: { room: true, subject: true }
            })
            if (suitableroom == null) {
                response.status(404).json(`Vhodná místnost s ID": ${request.body.id} neexistuje!`);
                return;
            }
            await suitableroom.remove();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Místnost ${suitableroom.room.name} pro ${suitableroom.subject.abbreviation} - ${UnitType[suitableroom.unitType]} úspěšně smazána.`);
        } catch (error) {
            console.log(error);
        }
    }
}
