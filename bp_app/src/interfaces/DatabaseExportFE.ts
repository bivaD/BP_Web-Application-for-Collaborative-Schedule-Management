/**
 * @file DatabaseExportFE.ts
 * @description In this file are definitions of datatypes which are used for exporting datas.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

export interface ISettingsDb{
    name: string,
    value: string
}

export interface IRoomDb {
    name: string,
    capacity: number,
    reservedHours: string[]
}

export interface IRoomDbRelations {
    name: string,
    capacity: number,
    reservedHours: string[],
    units: IUnitDb[],
    suitableRoom: ISuitableRoomDb[]
}

export interface ISubjectDb {
    abbreviation: string,
    name: string
}

export interface ISubjectDbRelations {
    abbreviation: string,
    name: string,
    units: IUnitDb[],
    suitableRoom: ISuitableRoomDb[]
}

export interface ILecturerDb {
    id: string,
    name: string,
    surname: string,
    titlesBefore: string,
    titlesAfter: string,
    timePriorities: number[],
}

export interface ILecturerDbRelations {
    id: string,
    name: string,
    surname: string,
    titlesBefore: string,
    titlesAfter: string,
    timePriorities: number[],
    units: IUnitDb[],
}

export interface IUnitDb{
    id: string,
    type: number,
    requiredCapacity: number,
    duration: number,
    periodic: boolean, 
    compulsory: boolean,
    frozen: boolean,
    weeks: number[],
    day: number,
    startTime: number,
}
export interface IUnitDbRelations{
    id: string,
    type: number,
    requiredCapacity: number,
    duration: number,
    periodic: boolean, 
    compulsory: boolean,
    frozen: boolean,
    weeks: number[],
    day: number,
    startTime: number,

    subject: ISubjectDb,
    room: IRoomDb,
    lecturers: ILecturerDb[],
    unitsA: IUnitDb[],
    unitsB: IUnitDb[],
}

export interface ISharedStudentsDb{
    id: string,
    count: number
}

export interface ISharedStudentsDbRelations{
    id: string,
    count: number
    unitA: IUnitDb,
    unitB: IUnitDb,
}

export interface ISuitableRoomDb{
    id: string;
    unitType: number;
}
export interface ISuitableRoomDbRelations{
    id: string;
    unitType: number;

    subject: ISubjectDb,
    room: IRoomDb,
}

export interface IDatabaseData{
    settings: ISettingsDb[],

    rooms: IRoomDbRelations[],
    subjects: ISubjectDbRelations[],
    lecturers: ILecturerDbRelations[],
    units: IUnitDbRelations[],

    sharedStudents: ISharedStudentsDbRelations[],
    suitableRooms: ISuitableRoomDbRelations[]
}