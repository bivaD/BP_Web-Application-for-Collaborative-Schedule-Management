/**
 * @file DatabaseExportBE.ts
 * @description In this file is definition of structure for exporting and importing database data.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Lecturer } from "../database/LecturerEntity";
import { Room } from "../database/RoomEntity";
import { Settings } from "../database/SettingsEntity";
import { SharedStudents } from "../database/SharedStudentsEntity";
import { Subject } from "../database/SubjectEntity";
import { SuitableRoom } from "../database/SuitableRoomEntity";
import { Unit } from "../database/UnitEntity";

export interface IDatabaseData{
    settings: Settings[],

    rooms: Room[],
    subjects: Subject[],
    lecturers: Lecturer[],
    units: Unit[],

    sharedStudents: SharedStudents[],
    suitableRooms: SuitableRoom[]
}