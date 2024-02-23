/**
 * @file TimetableController.ts
 * @description This file is controller for timetables.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { Room } from "../database/RoomEntity";
import { Unit } from "../database/UnitEntity";
import { IRoomTimetable, IRoomTimetableUnit } from "../interfaces/dataTypesBE";

export class TimetablesController {
    public static async getAllRoomTimetables(request: Request, response: Response) {
        try {
            var rooms: Room[] = await Room.find();
            var timetables: IRoomTimetable[] = [];
            for (var room of rooms) {
                timetables.push(
                    await this.getRoomTimetable(room.name)
                );
            }
            response.json(timetables);
        } catch (error) {
            console.log(error);
        }
    }
    public static async getRoomTimetable(roomName: string): Promise<IRoomTimetable> {
        const room: Room | null = await Room.findOne({
            where: { name: roomName },
        });
        if (room == null) {
            console.error(`Room with name ${roomName} not found.`);
            throw new Error(`Room with name ${roomName} not found.`);
        }
        var unitsInRoom: Unit[] = await Unit.find({
            where: {
                room: { name: roomName },
            },
            relations: {
                subject: true,
                lecturers: true,
            },
        });

        var timetableUnitsInRoom: IRoomTimetableUnit[] = [];
        var timetableUnit: IRoomTimetableUnit;
        for (var unit of unitsInRoom) {
            timetableUnit = {
                id: unit.id,
                subject: unit.subject,
                lecturers: unit.lecturers,

                type: unit.type,
                requiredCapacity: unit.requiredCapacity,
                weeks: unit.weeks,
                day: unit.day,
                startTime: unit.startTime,
                duration: unit.duration,
                periodic: unit.periodic,
                locked: false,
                frozen: unit.frozen,
                compulsory: unit.compulsory
            };
            timetableUnitsInRoom.push(timetableUnit);
        }
        var timetable: IRoomTimetable = {
            room: room,
            unitsInRoom: timetableUnitsInRoom,
        };
        return timetable;
    }
}
