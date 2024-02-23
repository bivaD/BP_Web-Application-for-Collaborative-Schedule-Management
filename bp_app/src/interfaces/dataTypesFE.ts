/**
 * @file dataTypesFE.ts
 * @description In this file are definitions of frontend datatypes.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

/***********
 *  ENUMS  *
 ***********/

export enum CollisionType{
    Place = 0,
    SuitablePlace,
    Lecturers,
    Preferneces,
    SharedStudentsA,
    SharedStudentsB,
    CompulsaryWithShared,
    Reservation,
    Capacity
}

export enum UnitType {
    Přednáška = 0,
    Cvičení,
    Democvičení,
    Zkouška,
    Laboratoř,
    Jiné
}

export enum WeekDaysType {
    unset = 0,
    Po,
    Út,
    St,
    Čt,
    Pá,
    So,
    Ne
}
/*************
 *  SUBJECT  *
 *************/

export interface ISubject {
    abbreviation: string,
    name: string
}
export interface ISubjectsRowAPI { //row in table
    abbreviation: string,
    name: string,
    unitCount: number
}


/***********
 *  ROOMS  *
 ***********/

export interface ISuitableRoom{
    id: string;
    subject: ISubject;
    unitType: number;
    room: IRoom;
}

export interface IRoom {
    name: string,
    capacity: number
    reservedHours: string[];
}

export interface IRoomTimetable {
    room: IRoom,
    unitsInRoom: IRoomTimetableUnit[]
}

/***************
 *  LECTURERS  *
 ***************/

export interface ILecturer {
    id: string,
    name: string,
    surname: string,
    titlesBefore: string,
    titlesAfter: string,
    timePriorities: number[],
}

/***********
 *  UNITS  *
 ***********/

export interface IUnit{
    id: string,
    subject: ISubject, 
    type: UnitType, 
    requiredCapacity: number,
    duration: number,
    frozen: boolean,
    periodic: boolean, 
    weeks: number[],
    day: WeekDaysType,
    startTime: number,
    room: IRoom,
    compulsory: boolean,
    lecturers: ILecturer[]
}
export interface IRoomTimetableUnit {
    id: string;
    
    subject: ISubject,
    lecturers: ILecturer[];

    type: UnitType;
    requiredCapacity: number;
    //list of weeks in semester, in which is this lesson, 0 means once, doesnt matter when (blokova vyuka)
    //number after 0 is exact week, which was assigned by user
    periodic: boolean,
    weeks: number[];
    //monday = 1, tuesday = 2.... sunday = 7
    day: WeekDaysType;
    //minutes from midnight of that day, assigned when user places unit to timetable
    startTime: number;
    //in minutes
    duration: number;
    compulsory: boolean,
    locked: boolean,
    frozen: boolean,
    hasCollision: boolean,
}


/****************
 *  COLLISIONS  *
 ****************/

export interface ISharedStudentsRowAPI {
    unitId: string;    
    unitName: string;    
    count: number[];
}

export interface ICollision{
    unitAId: string,
    unitBId: string,
    type: CollisionType,
    explanation:  string
}