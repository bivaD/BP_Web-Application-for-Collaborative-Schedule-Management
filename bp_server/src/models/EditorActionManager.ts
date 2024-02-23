/**
 * @file EditorActionsManager.ts
 * @description In this file is implementation of editor actions and actions around it.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { UnitLock } from "./UnitLock";
import { ICollision, WeekDaysType } from "../interfaces/dataTypesBE";
import { Server } from "socket.io";
import { Unit } from "../database/UnitEntity";
import { Room } from "../database/RoomEntity";
import { Collisions } from "./Collisions";

export class EditorActionManager {

    private unitLock: UnitLock;
    private collisions: Collisions;
    private io: Server;

    constructor(io: Server){
        this.unitLock = new UnitLock();
        this.io = io;
        this.collisions = new Collisions(this);
    }

    getAllCollisions(): ICollision[]{
        return this.collisions.getAllCollisions();
    }

    async refreshAllCollisions() {
        await this.collisions.refreshAllCollisions();
    }

    lockUnit(unitId: string, by:string): void {
        if(this.unitLock.lockUnit(unitId, by)){
            this.notifyUnitLocked(unitId);
        } else {
            this.notifyLockUnitDeny(unitId, "Jiný uživatel momentálně pracuje s touto lekcí.");
        }
    }

    unlockUnit(unitId: string, by:string): void {
        if(this.unitLock.unlockUnit(unitId, by)){
            this.notifyUnitUnlocked(unitId);
        } else {
            console.log(`Unlocking unit failed, unit ID ${unitId} by ${by}`);
        }
    }

    unlockAll(by: string): void {
        this.unitLock.unlockAll(by);
    }

    async frozenToggle(unitId: string, by:string, froze: boolean): Promise<void> {
        if(this.unitLock.lockUnit(unitId, by)){
            try {
                var unit: Unit | null = await Unit.findOne({where: {id: unitId}})
                if(unit == null){
                    this.notifyUnitMovingFailed(unitId, "Nepodařilo se zamrazit lekci.");
                    this.unlockUnit(unitId, by);
                    return;
                }

                unit.frozen = froze;

                await unit.save();

                if(froze){
                    this.notifyUnitFrozen(unitId);
                } else {
                    this.notifyUnitUnfrozen(unitId);
                }
                this.unlockUnit(unitId, by);
            } catch(e){
                console.log('Moving frozing failed' + e);
                this.notifyUnitMovingFailed(unitId, "Nepodařilo se zamrazit lekci.");
                this.unlockUnit(unitId, by);
                return;
            }
        } else {
            this.notifyUnitMovingFailed(unitId, "Jiný uživatel momentálně pracuje s touto lekcí.");
        }
    }

    async replaceUnit(by: string, sourceUnitId: string, targetUnitId: string, inWeek: number): Promise<void> {
        try {
            const sourceUnit: Unit | null = await Unit.findOne({ where: {id: sourceUnitId}, relations: {room: true}})
            const targetUnit: Unit | null = await Unit.findOne({ where: {id: targetUnitId}, relations: {room: true}})
            if(sourceUnit == null || targetUnit == null) {
                console.error("One of units from replace action is null, skipped.")
                return;
            }
            if(!sourceUnit.periodic && inWeek == 0){
                console.log('[SERVER] you can\'t place block lections to periodic timetable, moving refused')
                this.unlockUnit(sourceUnitId, by);
                return;
            }
            if(this.unitLock.isLockedBy(sourceUnitId, by)){
                if(this.unitLock.lockUnit(targetUnitId, by)){
                    if(sourceUnit.periodic){
                        await this.moveUnit(by, sourceUnitId, targetUnit.room.name, targetUnit.day, targetUnit.startTime, targetUnit.weeks);
                    } else {
                        await this.moveUnit(by, sourceUnitId, targetUnit.room.name, targetUnit.day, targetUnit.startTime, [inWeek]);
                    }
                    await this.moveUnit(by, targetUnitId, "unsorted", WeekDaysType.unset, -1, targetUnit.weeks);
                }
            }
        } catch(e){
            console.log('Replacing unit unsuccesful: ' + e);
            return;
        }
    }

    async moveUnitToStack(by: string, unitId: string): Promise<void> {
        const unit: Unit | null = await Unit.findOne({where: {id: unitId}});
        if(unit == null){
            return;
        }
        await this.moveUnit(by, unitId, "unsorted", WeekDaysType.unset, -1, unit?.weeks);
    }

    async moveUnit(by: string, unitId: string, toRoom: string, toDay: WeekDaysType, toTime: number, toWeeks:number[]): Promise<void> {
        if(this.unitLock.isLockedBy(unitId, by)){
            try {
                var unit: Unit | null = await Unit.findOne({where: {id: unitId}})
                var room = await Room.findOne({ where: {name: toRoom}});
                if(unit == null || room == null){
                    this.notifyUnitMovingFailed(unitId, "Nepodařilo se přesunout lekci.");
                    this.unlockUnit(unitId, by);
                    return;
                }
                if(!unit.periodic && JSON.stringify(toWeeks) == JSON.stringify([0])){
                    console.log('[SERVER] you can\'t place block lections to periodic timetable, moving refused')
                    this.unlockUnit(unitId, by);
                    return;
                }
                unit.room = room;
                unit.day = toDay;
                unit.startTime = toTime;
                unit.weeks = unit.periodic ? unit.weeks : toWeeks;
                await unit.save();
                if(unit.room.name == "unsorted"){
                    this.collisions.refreshStackUnitCollisions(unitId);
                } else {
                    await this.collisions.refreshUnitCollisions(unitId);
                }

                this.notifyUnitMoved(unitId, toRoom, toDay, toTime, toWeeks);
                this.unlockUnit(unitId, by);
            } catch(e){
                console.log('Moving unit failed' + e);
                this.notifyUnitMovingFailed(unitId, "Nepodařilo se přesunout lekci.");
                this.unlockUnit(unitId, by);
                return;
            }
        } else {
            this.notifyUnitMovingFailed(unitId, "Jiný uživatel momentálně pracuje s touto lekcí.");
        }
    }

    async dataUpdated(){
        await this.refreshAllCollisions();
        this.notifyDataUpdated();
    }


    notifyLockUnitAccept(unitId: string) {
        this.io.emit("lockUnitAccept", unitId);
        console.log(`[Server -> Client] lockUnitAccept with id ${unitId}`);

    }
    notifyLockUnitDeny(unitId: string, reason: string) {
        this.io.emit("lockUnitDeny", unitId, reason);
        console.log(`[Server -> Client] lockUnitDeny with id ${unitId} because ${reason}`);
    }
    notifyUnitLocked(unitId: string) {
        this.io.emit("unitLocked", unitId);
        console.log(`[Server -> Client] unitLocked with id ${unitId}`);
    }
    notifyUnitUnlocked(unitId: string) {
        this.io.emit("unitUnlocked", unitId);
        console.log(`[Server -> Client] unitUnlocked with id ${unitId}`);
    }

    notifyUnitFrozen(unitId: string) {
        this.io.emit("unitFrozen", unitId);
        console.log(`[Server -> Client] unitFrozen with id ${unitId}`);
    }
    notifyUnitUnfrozen(unitId: string) {
        this.io.emit("unitUnfrozen", unitId);
        console.log(`[Server -> Client] unitUnfrozen with id ${unitId}`);
    }


    notifyUnitMoved(
        unitId: string,
        toRoom: string,
        toDay: WeekDaysType,
        toTime: number,
        toWeeks: number[]
    ) {
        this.io.emit("unitMoved", unitId, toRoom, toDay, toTime, toWeeks);
        console.log(`[Server -> Client] unitMoved with id ${unitId} to ${toRoom} at day ${toDay} on time ${toTime}`);
    }
    notifyUnitMovedToStack(unitId: string) {
        this.io.emit("unitMovedToStack", unitId);
        console.log(`[Server -> Client] unitMovedToStack with id ${unitId}`);
    }

    //todo sjednotit s notifyLockUnitDeny ?
    notifyUnitMovingFailed(unitId: string, reason: string) {
    }

    notifyDataUpdated(){
        this.io.emit("dataUpdated");
        console.log(`[Server -> Client] dataUpdated`);
    }

    notifyCollisionAdded(collision: ICollision){
        this.io.emit("collisionAdded", collision);
        console.log(`[Server -> Client] collisionAdded between units ${collision.unitAId} and ${collision.unitBId}`);
    }
    notifyAllCollisionsRemoved(){
        this.io.emit("allCollisionsRemoved");
        console.log(`[Server -> Client] allCollisionsRemoved`);
    }
    notifyUnitCollisionsRemoved(unitId:string){
        this.io.emit("unitCollisionsRemoved", unitId);
        console.log(`[Server -> Client] unitCollisionsRemoved related to unit ${unitId}`);
    }
}