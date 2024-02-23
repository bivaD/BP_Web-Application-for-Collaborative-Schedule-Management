/**
 * @file dataTypesBE.ts
 * @description In this file are definitions of server types and structures.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

/***********
 *  ENUMS  *
 ***********/

import { Lecturer } from "../database/LecturerEntity";
import { Room } from "../database/RoomEntity";
import { Subject } from "../database/SubjectEntity";

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
    Rezervace,
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

export interface IRoomTimetable {
    room: Room,
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
    timePriorities: number[]
}

/***********
 *  UNITS  *
 ***********/

export interface IRoomTimetableUnit {
    id: string;
    
    subject: Subject,
    lecturers: Lecturer[],

    type: UnitType,
    requiredCapacity: number
    //list of weeks in semester, in which is this lesson, 0 means once, doesnt matter when (blokova vyuka)
    //number after 0 is exact week, which was assigned by user
    periodic: boolean,
    weeks: number[],
    //monday = 1, tuesday = 2.... sunday = 7
    day: WeekDaysType,
    //minutes from midnight of that day, assigned when user places unit to timetable
    startTime: number,
    //in minutes
    duration: number,
    locked: boolean,
    frozen: boolean,
    compulsory: boolean
}

/****************
 *  COLLISIONS  *
 ****************/

export interface ISharedStudentsRowAPI {
    unitId: string;    
    unitName: string;    
    count: string[];
}

export interface ICollision{
    unitAId: string,
    unitBId: string,
    type: CollisionType,
    explanation:  string
}