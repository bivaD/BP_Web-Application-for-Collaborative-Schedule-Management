"use strict";
/**
 * @file EditorActionsManager.ts
 * @description In this file is implementation of editor actions and actions around it.
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
exports.EditorActionManager = void 0;
const UnitLock_1 = require("./UnitLock");
const dataTypesBE_1 = require("../interfaces/dataTypesBE");
const UnitEntity_1 = require("../database/UnitEntity");
const RoomEntity_1 = require("../database/RoomEntity");
const Collisions_1 = require("./Collisions");
class EditorActionManager {
    constructor(io) {
        this.unitLock = new UnitLock_1.UnitLock();
        this.io = io;
        this.collisions = new Collisions_1.Collisions(this);
    }
    getAllCollisions() {
        return this.collisions.getAllCollisions();
    }
    refreshAllCollisions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collisions.refreshAllCollisions();
        });
    }
    lockUnit(unitId, by) {
        if (this.unitLock.lockUnit(unitId, by)) {
            this.notifyUnitLocked(unitId);
        }
        else {
            this.notifyLockUnitDeny(unitId, "Jiný uživatel momentálně pracuje s touto lekcí.");
        }
    }
    unlockUnit(unitId, by) {
        if (this.unitLock.unlockUnit(unitId, by)) {
            this.notifyUnitUnlocked(unitId);
        }
        else {
            console.log(`Unlocking unit failed, unit ID ${unitId} by ${by}`);
        }
    }
    unlockAll(by) {
        this.unitLock.unlockAll(by);
    }
    frozenToggle(unitId, by, froze) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.unitLock.lockUnit(unitId, by)) {
                try {
                    var unit = yield UnitEntity_1.Unit.findOne({ where: { id: unitId } });
                    if (unit == null) {
                        this.notifyUnitMovingFailed(unitId, "Nepodařilo se zamrazit lekci.");
                        this.unlockUnit(unitId, by);
                        return;
                    }
                    unit.frozen = froze;
                    yield unit.save();
                    if (froze) {
                        this.notifyUnitFrozen(unitId);
                    }
                    else {
                        this.notifyUnitUnfrozen(unitId);
                    }
                    this.unlockUnit(unitId, by);
                }
                catch (e) {
                    console.log('Moving frozing failed' + e);
                    this.notifyUnitMovingFailed(unitId, "Nepodařilo se zamrazit lekci.");
                    this.unlockUnit(unitId, by);
                    return;
                }
            }
            else {
                this.notifyUnitMovingFailed(unitId, "Jiný uživatel momentálně pracuje s touto lekcí.");
            }
        });
    }
    replaceUnit(by, sourceUnitId, targetUnitId, inWeek) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sourceUnit = yield UnitEntity_1.Unit.findOne({ where: { id: sourceUnitId }, relations: { room: true } });
                const targetUnit = yield UnitEntity_1.Unit.findOne({ where: { id: targetUnitId }, relations: { room: true } });
                if (sourceUnit == null || targetUnit == null) {
                    console.error("One of units from replace action is null, skipped.");
                    return;
                }
                if (!sourceUnit.periodic && inWeek == 0) {
                    console.log('[SERVER] you can\'t place block lections to periodic timetable, moving refused');
                    this.unlockUnit(sourceUnitId, by);
                    return;
                }
                if (this.unitLock.isLockedBy(sourceUnitId, by)) {
                    if (this.unitLock.lockUnit(targetUnitId, by)) {
                        if (sourceUnit.periodic) {
                            yield this.moveUnit(by, sourceUnitId, targetUnit.room.name, targetUnit.day, targetUnit.startTime, targetUnit.weeks);
                        }
                        else {
                            yield this.moveUnit(by, sourceUnitId, targetUnit.room.name, targetUnit.day, targetUnit.startTime, [inWeek]);
                        }
                        yield this.moveUnit(by, targetUnitId, "unsorted", dataTypesBE_1.WeekDaysType.unset, -1, targetUnit.weeks);
                    }
                }
            }
            catch (e) {
                console.log('Replacing unit unsuccesful: ' + e);
                return;
            }
        });
    }
    moveUnitToStack(by, unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield UnitEntity_1.Unit.findOne({ where: { id: unitId } });
            if (unit == null) {
                return;
            }
            yield this.moveUnit(by, unitId, "unsorted", dataTypesBE_1.WeekDaysType.unset, -1, unit === null || unit === void 0 ? void 0 : unit.weeks);
        });
    }
    moveUnit(by, unitId, toRoom, toDay, toTime, toWeeks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.unitLock.isLockedBy(unitId, by)) {
                try {
                    var unit = yield UnitEntity_1.Unit.findOne({ where: { id: unitId } });
                    var room = yield RoomEntity_1.Room.findOne({ where: { name: toRoom } });
                    if (unit == null || room == null) {
                        this.notifyUnitMovingFailed(unitId, "Nepodařilo se přesunout lekci.");
                        this.unlockUnit(unitId, by);
                        return;
                    }
                    if (!unit.periodic && JSON.stringify(toWeeks) == JSON.stringify([0])) {
                        console.log('[SERVER] you can\'t place block lections to periodic timetable, moving refused');
                        this.unlockUnit(unitId, by);
                        return;
                    }
                    unit.room = room;
                    unit.day = toDay;
                    unit.startTime = toTime;
                    unit.weeks = unit.periodic ? unit.weeks : toWeeks;
                    yield unit.save();
                    if (unit.room.name == "unsorted") {
                        this.collisions.refreshStackUnitCollisions(unitId);
                    }
                    else {
                        yield this.collisions.refreshUnitCollisions(unitId);
                    }
                    this.notifyUnitMoved(unitId, toRoom, toDay, toTime, toWeeks);
                    this.unlockUnit(unitId, by);
                }
                catch (e) {
                    console.log('Moving unit failed' + e);
                    this.notifyUnitMovingFailed(unitId, "Nepodařilo se přesunout lekci.");
                    this.unlockUnit(unitId, by);
                    return;
                }
            }
            else {
                this.notifyUnitMovingFailed(unitId, "Jiný uživatel momentálně pracuje s touto lekcí.");
            }
        });
    }
    dataUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshAllCollisions();
            this.notifyDataUpdated();
        });
    }
    notifyLockUnitAccept(unitId) {
        this.io.emit("lockUnitAccept", unitId);
        console.log(`[Server -> Client] lockUnitAccept with id ${unitId}`);
    }
    notifyLockUnitDeny(unitId, reason) {
        this.io.emit("lockUnitDeny", unitId, reason);
        console.log(`[Server -> Client] lockUnitDeny with id ${unitId} because ${reason}`);
    }
    notifyUnitLocked(unitId) {
        this.io.emit("unitLocked", unitId);
        console.log(`[Server -> Client] unitLocked with id ${unitId}`);
    }
    notifyUnitUnlocked(unitId) {
        this.io.emit("unitUnlocked", unitId);
        console.log(`[Server -> Client] unitUnlocked with id ${unitId}`);
    }
    notifyUnitFrozen(unitId) {
        this.io.emit("unitFrozen", unitId);
        console.log(`[Server -> Client] unitFrozen with id ${unitId}`);
    }
    notifyUnitUnfrozen(unitId) {
        this.io.emit("unitUnfrozen", unitId);
        console.log(`[Server -> Client] unitUnfrozen with id ${unitId}`);
    }
    notifyUnitMoved(unitId, toRoom, toDay, toTime, toWeeks) {
        this.io.emit("unitMoved", unitId, toRoom, toDay, toTime, toWeeks);
        console.log(`[Server -> Client] unitMoved with id ${unitId} to ${toRoom} at day ${toDay} on time ${toTime}`);
    }
    notifyUnitMovedToStack(unitId) {
        this.io.emit("unitMovedToStack", unitId);
        console.log(`[Server -> Client] unitMovedToStack with id ${unitId}`);
    }
    //todo sjednotit s notifyLockUnitDeny ?
    notifyUnitMovingFailed(unitId, reason) {
    }
    notifyDataUpdated() {
        this.io.emit("dataUpdated");
        console.log(`[Server -> Client] dataUpdated`);
    }
    notifyCollisionAdded(collision) {
        this.io.emit("collisionAdded", collision);
        console.log(`[Server -> Client] collisionAdded between units ${collision.unitAId} and ${collision.unitBId}`);
    }
    notifyAllCollisionsRemoved() {
        this.io.emit("allCollisionsRemoved");
        console.log(`[Server -> Client] allCollisionsRemoved`);
    }
    notifyUnitCollisionsRemoved(unitId) {
        this.io.emit("unitCollisionsRemoved", unitId);
        console.log(`[Server -> Client] unitCollisionsRemoved related to unit ${unitId}`);
    }
}
exports.EditorActionManager = EditorActionManager;
