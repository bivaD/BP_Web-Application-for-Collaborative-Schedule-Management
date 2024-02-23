/**
 * @file SocketioTypesFE.ts
 * @description In this file are definion of types for SocketIO messages.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import type { ICollision, ILecturer, IRoom, IRoomTimetableUnit, ISubject, WeekDaysType } from "./dataTypesFE";

export interface ServerToClientEvents {
    //locking operations
    lockUnitDeny: (unitId: string, reason: string) => void;
    unitLocked: (unitId: string) => void;
    unitUnlocked: (unitId: string) => void;

    unitFrozen: (unitId: string) => void;
    unitUnfrozen: (unitId: string) => void;

    //editor actions
    unitMoved: (unitId: string, toRoom: string, toDay: WeekDaysType, toTime: number, toWeeks:number[]) => void;
    unitMovedToStack: (unitId: string) => void;

    unitMovingFailed: (unitId: string, reason: string) => void;
    
    dataUpdated: () => void;

    sharedstudentsUpdated: (sharedstudents: ICollision) => void;

    collisionAdded: (collision: ICollision) => void;
    allCollisionsRemoved: () => void;
    unitCollisionsRemoved: (unitId: string) => void;

    test: () => void;
}

export interface ClientToServerEvents {
    //locking operations
    lockUnit: (unitId: string) => void;
    unlockUnit: (unitId: string) => void;
    unlockAll: () => void;

    //editor actions
    freezeUnit: (unitId: string) => void;
    unfreezeUnit: (unitId: string) => void;
    moveUnit: (unitId: string, toRoom: string, toDay: WeekDaysType, toTime: number, toWeeks?:number[]) => void;
    moveUnitToStack: (unitId: string) => void;
    replaceUnit: (sourceUnitId: string, targetUnitId: string, inWeek: number) => void;
}

export interface InterServerEvents {
}

export interface SocketData {

}
