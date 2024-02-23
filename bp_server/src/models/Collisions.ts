/**
 * @file Collisions.ts
 * @description In this file is implementation of collision detection.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Not } from "typeorm";
import { Lecturer } from "../database/LecturerEntity";
import { Settings } from "../database/SettingsEntity";
import { SharedStudents } from "../database/SharedStudentsEntity";
import { SuitableRoom } from "../database/SuitableRoomEntity";
import { Unit } from "../database/UnitEntity";
import { ICollision, CollisionType, WeekDaysType, UnitType } from "../interfaces/dataTypesBE";
import { EditorActionManager } from "./EditorActionManager";
export class Collisions {
    private collisions: ICollision[];
    private manager: EditorActionManager;

    constructor(manager: EditorActionManager) {
        this.collisions = [];
        this.manager = manager;
    }

    private addCollision(unitAId: string, unitBId: string, type: CollisionType, explanation: string): boolean {

        if (this.collisions.find((c) => { return c.type == type && ((c.unitAId == unitAId && c.unitBId == unitBId) || (c.unitAId == unitBId && c.unitBId == unitAId)); })) {
            return false;
        } else {
            const newCollision: ICollision = {
                unitAId: unitAId,
                unitBId: unitBId,
                type: type,
                explanation: explanation,
            };

            this.collisions.push(newCollision);
            this.manager.notifyCollisionAdded(newCollision);
            return true;
        }
    }
    getAllCollisions(): ICollision[]{
        return this.collisions;
    }

    getCollisionsOfUnit(unitId: string): ICollision[] {
        var unitCollisions: ICollision[] = [];
        for (var collision of this.collisions) {
            if (collision.unitAId == unitId || collision.unitBId == unitId) {
                unitCollisions.push(collision);
            }
        }
        return unitCollisions;
    }

    async getSettings(settingsName: string): Promise<number> {
        try {
            const result: Settings | null = await Settings.findOne({ where: { name: settingsName } });
            if (result == null) {
                return -1;
            } else {
                return JSON.parse(result.value);
            }
        } catch (error) {
            return -1;
        }
    }

    async refreshUnitCollisions(unitId: string) {
        this.removeUnitCollisions(unitId);
        this.manager.notifyUnitCollisionsRemoved(unitId);
        await this.findUnitCollisions(unitId);
    }

    refreshStackUnitCollisions(unitId: string) {
        this.removeUnitCollisions(unitId);
        this.manager.notifyUnitCollisionsRemoved(unitId);
    }

    async refreshAllCollisions() {
        this.collisions = [];
        this.manager.notifyAllCollisionsRemoved();
        await this.findAllCollisions();
    }

    // private methods

    private timeCollision(unitA: Unit, unitB: Unit): boolean {
        const startA = unitA.startTime;
        const startB = unitB.startTime;
        const endA = unitA.startTime + unitA.duration;
        const endB = unitB.startTime + unitB.duration;
        if ((startA <= startB && startB < endA) || //B starts in A
            (startA < endB && endB <= endA) ||   //B ends in A
            (startA <= startB && endB <= endA) || //B                                                                                                                                                                                                                                                                                                                                           is inside A
            (startB <= startA && endA <= endB)) { // A is inside B
            return true;
        } else {
            return false;
        }
    }
    private intersection<T>(arrayA: T[], arrayB: T[]): T[] {
        return arrayA.filter((element) => {
            for (var elementB of arrayB) {
                if (JSON.stringify(element) == JSON.stringify(elementB)) {
                    return true;
                }
            }
        });
    }

    private weekCollision(unitA: Unit, unitB: Unit): boolean {
        const commonWeeks = this.intersection(unitA.weeks, unitB.weeks);
        if (commonWeeks.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    private async getSharedStudents(unitA: Unit, unitB: Unit): Promise<number> {
        try {
            const sharedStudents: SharedStudents | null = await SharedStudents.findOne({
                where: [
                    { unitA: { id: unitA.id }, unitB: { id: unitB.id } },
                    { unitA: { id: unitB.id }, unitB: { id: unitA.id } },
                ],
            });
            if (sharedStudents == null) {
                return 0;
            } else {
                return sharedStudents.count;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    private displayTime(time: number): string {
        return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`
    }

    private displayUnitInfo(unit: Unit, displayRoom: boolean = true): string {
        var displayString: string = `${unit.subject.abbreviation} - ${UnitType[unit.type]} v ${WeekDaysType[unit.day]} v čase ${this.displayTime(unit.startTime)}`
        if (displayRoom) {
            displayString += ` v místnosti ${unit.room.name}`
        }
        return displayString;
    }

    private async findUnitCollisions(unitId: string) {
        try {
            const unit = await Unit.findOneOrFail({
                where: { id: unitId },
                relations: {
                    room: true,
                    lecturers: true,
                    subject: true,
                },
            });
            //this will find all other units, which are in same day as the one, with which we are looking for collisions
            const units: Unit[] = await Unit.find({
                where: { day: unit.day, id: Not(unitId) },
                relations: {
                    room: true,
                    lecturers: true,
                    subject: true,
                },
            });

            for (var unitB of units) {
                //if they have some time overlap in at least one of the weeks, then they are suspicious
                if (this.weekCollision(unit, unitB) && this.timeCollision(unit, unitB)) {
                    this.findPlaceCollision(unit, unitB);
                    this.findLecturersCollisions(unit, unitB);
                    this.findSharedStudentsCollisions(unit, unitB);
                }
            }
            this.findCapacityCollisions(unit);
            this.findSuitableRoomsCollision(unit);
            this.findCollisionsWithLecturersPreferences(unit);
            this.findCollisionsWithReservations(unit);
        } catch (error) {
            console.log(error);
        }
    }

    private async findCapacityCollisions(unit: Unit) {
        if (unit.compulsory) {
            if (unit.room.capacity < unit.requiredCapacity) {
                const explanation: string =
                    `[PŘEPLNĚNÁ MÍSTNOST] Místnost ${unit.room.name} nemá dostatečnou kapacitu pro povinnou lekci ${this.displayUnitInfo(unit, false)}.`;
                this.addCollision(unit.id, unit.id, CollisionType.Capacity, explanation);
            }
        } else {
            try {
                var virtualCapacitySettings: Settings | null = await Settings.findOneOrFail({ where: { name: 'virtualCapacityPercentage' } });
                if (virtualCapacitySettings != null) {
                    const virtualCapacityPercentage: number = JSON.parse(virtualCapacitySettings.value)
                    if (Math.floor(unit.room.capacity * virtualCapacityPercentage / 100) < unit.requiredCapacity) {
                        const explanation: string =
                            `[PŘEPLNĚNÁ MÍSTNOST] Místnost ${unit.room.name} nemá dostatečnou virtuální kapacitu pro lekci ${this.displayUnitInfo(unit, false)}.`;
                        this.addCollision(unit.id, unit.id, CollisionType.Capacity, explanation);
                    }
                }
            } catch (error) {
                console.log('Chyba při kalkulaci nedostatečné virtuální kapacity');
                console.log(error);
            }
        }
    }
    private async findSharedStudentsCollisions(unit: Unit, unitB: Unit) {
        const sharedStudents: number = await this.getSharedStudents(unit, unitB);

        var unitAPercentage: number = Math.ceil((100 / unit.requiredCapacity) * sharedStudents)
        var unitBPercentage: number = Math.ceil((100 / unitB.requiredCapacity) * sharedStudents)
        var treshold = await this.getSettings('sharedStudentsTreshold');

        if (unitAPercentage >= treshold) {
            const explanation: string =
                `[VYSOKÝ PŘEKRYV STUDENTŮ] - ${this.displayUnitInfo(unit)} má ${unitAPercentage}% společných studentů s ${this.displayUnitInfo(unitB)}, to je více než nastavený limit ${treshold}%`;
            this.addCollision(unit.id, unitB.id, CollisionType.SharedStudentsA, explanation);
        }
        if (unitBPercentage >= treshold) {
            const explanation: string =
                `[VYSOKÝ PŘEKRYV STUDENTŮ] - ${this.displayUnitInfo(unitB)} má ${unitBPercentage}% společných studentů s ${this.displayUnitInfo(unit)}, to je více než nastavený limit ${treshold}%`;
            this.addCollision(unit.id, unitB.id, CollisionType.SharedStudentsB, explanation);
        }

        if (sharedStudents > 0 && unit.compulsory && unitB.compulsory) {
            const explanation: string =
                `[PŘEKRYV STUDENTŮ POVINNNÝCH LEKCÍ] - ${this.displayUnitInfo(unit)} má ${sharedStudents} společných studentů s ${this.displayUnitInfo(unitB)}, přestože jsou obě lekce povinné.`;
            this.addCollision(unit.id, unitB.id, CollisionType.CompulsaryWithShared, explanation);
        }
    }

    private findLecturersCollisions(unit: Unit, unitB: Unit) {
        const lecturersIntersection: Lecturer[] = this.intersection(unit.lecturers, unitB.lecturers);
        if (lecturersIntersection.length > 0) {
            var lecturerString = "";
            for (var lecturer of lecturersIntersection) {
                lecturerString += `, ${lecturer.surname} ${lecturer.name}, ${lecturer.titlesBefore} ${lecturer.titlesAfter}`;
            }
            const explanation: string =
                `[KOLIZE PŘEDNÁŠEJÍCÍCH] - ${this.displayUnitInfo(unit)} a ${this.displayUnitInfo(unitB)} mají stejné přednášející:${lecturerString}.`;
            this.addCollision(unit.id, unitB.id, CollisionType.Lecturers, explanation);
        }
    }

    private findPlaceCollision(unit: Unit, unitB: Unit) {
        if (unit.room.name == unitB.room.name) {
            const explanation: string =
                `[KOLIZE MÍSTA] v místnosti ${unit.room.name} - ${this.displayUnitInfo(unit, false)} a ${this.displayUnitInfo(unitB, false)}`;
            this.addCollision(unit.id, unitB.id, CollisionType.Place, explanation);
        }
    }
    private async findSuitableRoomsCollision(unit: Unit) {
        const suitableRooms: SuitableRoom[] = await SuitableRoom.find({ where: { unitType: unit.type, subject: { abbreviation: unit.subject.abbreviation } }, relations: { subject: true, room: true } })
        if (suitableRooms.length > 0) {
            if (!(suitableRooms.find((sr) => { return sr.room.name == unit.room.name }) ?? false)) {
                const explanation: string =
                    `[NEVHODNÁ MÍSTNOST] Místnost ${unit.room.name} není vhodná pro ${this.displayUnitInfo(unit, false)}.`;
                this.addCollision(unit.id, unit.id, CollisionType.SuitablePlace, explanation);
            }
        }
    }
    private async findCollisionsWithLecturersPreferences(unit: Unit) {
        var first: number = Math.floor(unit.startTime / 60);
        var last: number = Math.floor((unit.startTime + unit.duration - 1) / 60);

        var lowest_preference = 5;
        for (var lecturer of unit.lecturers) {
            for (var i: number = first; i <= last; i++) {
                if (lecturer.timePriorities[((unit.day - 1) * 24 + i)] < lowest_preference) {
                    lowest_preference = lecturer.timePriorities[unit.day * i];
                }
            }
            if (lowest_preference == 0) {
                const explanation: string =
                    `[NEMŮŽE UČIT] - ${lecturer.surname} ${lecturer.name}, ${lecturer.titlesBefore} ${lecturer.titlesAfter} nemůže učit v čase lekce ${this.displayUnitInfo(unit)}.`;
                this.addCollision(unit.id, unit.id, CollisionType.Preferneces, explanation);
            } else if (lowest_preference <= await this.getSettings('preferencesTreshold')) {
                const explanation: string =
                    `[NEPREFERUJE UČIT] - ${lecturer.surname} ${lecturer.name}, ${lecturer.titlesBefore} ${lecturer.titlesAfter} nepreferuje učit v čase lekce ${this.displayUnitInfo(unit)}. Jeho preference je ${lowest_preference}/5.`;
                this.addCollision(unit.id, unit.id, CollisionType.Preferneces, explanation);
            }
            lowest_preference = 5;
        }
    }

    private async  findCollisionsWithReservations(unit: Unit) {
        var first: number = Math.floor(unit.startTime / 60);
        var last: number = Math.floor((unit.startTime + unit.duration - 1) / 60);

        for (var i: number = first; i <= last; i++) {
            if (unit.room.reservedHours[((unit.day - 1) * 24 + i)] == 'reserved') {
                const explanation: string =
                    `[KOLIZE S REZERVACÍ] - Lekce ${this.displayUnitInfo(unit)} je rozrhnuta na čas, který je rezervovaný pro jiné účely.`;
                this.addCollision(unit.id, unit.id, CollisionType.Reservation, explanation);
            }
        }
    }

    private async findAllCollisionsInDay(day: WeekDaysType): Promise<void> {
        const unitsInDay = await Unit.find({
            where: { day: day },
            relations: {
                room: true,
                lecturers: true,
                subject: true,
            },
        });
        for (var unit of unitsInDay) {
            this.findUnitCollisions(unit.id);
        }
    }

    private async findAllCollisions(): Promise<void> {
        var allPromises = Promise.all([
            this.findAllCollisionsInDay(WeekDaysType.Po),
            this.findAllCollisionsInDay(WeekDaysType.Út),
            this.findAllCollisionsInDay(WeekDaysType.St),
            this.findAllCollisionsInDay(WeekDaysType.Čt),
            this.findAllCollisionsInDay(WeekDaysType.Pá),
            this.findAllCollisionsInDay(WeekDaysType.So),
            this.findAllCollisionsInDay(WeekDaysType.Ne),
        ]);
        try {
            await allPromises;
        } catch (error) {
            console.log(error);
        }
    }

    private removeUnitCollisions(unitId: string) {
        this.collisions = this.collisions.filter((c) => {
            return !(c.unitAId == unitId || c.unitBId == unitId)
        });
    }
}
