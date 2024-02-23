/**
 * @file UnitLock.ts
 * @description In this file is implementation of locking units.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

export class UnitLock {
    private locked_units: string[];
    private locked_by: string[];

    constructor(){
        this.locked_units = [];
        this.locked_by = [];
    }

    lockUnit(unitId: string, whoLocked: string): boolean {
        if(this.locked_units.includes(unitId)){
            return false;
        } else {
            this.locked_units.push(unitId);
            this.locked_by.push(whoLocked);
            return true;
        }
    }
    isLockedBy(unitId: string, whoLocked: string): boolean {
        var index:number = this.locked_units.indexOf(unitId);
        if(index == -1){
            return false;
        } else if( this.locked_by[index] == whoLocked){
            return true;
        } else {
            return false;
        }
    }
    unlockUnit(unitId: string, whoLocked: string) {
        const index: number = this.locked_units.indexOf(unitId)
        if(index == -1) { //unit is not locked, no need to unlock
            return false;
        } else if (this.locked_by[index] !== whoLocked) { //unit is locked by somebody else
            return false;
        } else {
            this.locked_units.splice(index, 1);
            this.locked_by.splice(index, 1);
            return true;
        }
    }

    unlockAll(whoLocked: string){
    var index: number = this.locked_by.indexOf(whoLocked);
        while(index != -1){
            this.locked_units.splice(index, 1);
            this.locked_by.splice(index, 1);
            index = this.locked_by.indexOf(whoLocked);
        }
    }
}