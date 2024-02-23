"use strict";
/**
 * @file dataTypesBE.ts
 * @description In this file are definitions of server types and structures.
 * @author David Novák
 * @created 9. March 2023
 *
 * This code is part of a bachelor's thesis at the FIT BUT.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekDaysType = exports.UnitType = exports.CollisionType = void 0;
var CollisionType;
(function (CollisionType) {
    CollisionType[CollisionType["Place"] = 0] = "Place";
    CollisionType[CollisionType["SuitablePlace"] = 1] = "SuitablePlace";
    CollisionType[CollisionType["Lecturers"] = 2] = "Lecturers";
    CollisionType[CollisionType["Preferneces"] = 3] = "Preferneces";
    CollisionType[CollisionType["SharedStudentsA"] = 4] = "SharedStudentsA";
    CollisionType[CollisionType["SharedStudentsB"] = 5] = "SharedStudentsB";
    CollisionType[CollisionType["CompulsaryWithShared"] = 6] = "CompulsaryWithShared";
    CollisionType[CollisionType["Reservation"] = 7] = "Reservation";
    CollisionType[CollisionType["Capacity"] = 8] = "Capacity";
})(CollisionType = exports.CollisionType || (exports.CollisionType = {}));
var UnitType;
(function (UnitType) {
    UnitType[UnitType["P\u0159edn\u00E1\u0161ka"] = 0] = "P\u0159edn\u00E1\u0161ka";
    UnitType[UnitType["Cvi\u010Den\u00ED"] = 1] = "Cvi\u010Den\u00ED";
    UnitType[UnitType["Democvi\u010Den\u00ED"] = 2] = "Democvi\u010Den\u00ED";
    UnitType[UnitType["Zkou\u0161ka"] = 3] = "Zkou\u0161ka";
    UnitType[UnitType["Laborato\u0159"] = 4] = "Laborato\u0159";
    UnitType[UnitType["Rezervace"] = 5] = "Rezervace";
    UnitType[UnitType["Jin\u00E9"] = 6] = "Jin\u00E9";
})(UnitType = exports.UnitType || (exports.UnitType = {}));
var WeekDaysType;
(function (WeekDaysType) {
    WeekDaysType[WeekDaysType["unset"] = 0] = "unset";
    WeekDaysType[WeekDaysType["Po"] = 1] = "Po";
    WeekDaysType[WeekDaysType["\u00DAt"] = 2] = "\u00DAt";
    WeekDaysType[WeekDaysType["St"] = 3] = "St";
    WeekDaysType[WeekDaysType["\u010Ct"] = 4] = "\u010Ct";
    WeekDaysType[WeekDaysType["P\u00E1"] = 5] = "P\u00E1";
    WeekDaysType[WeekDaysType["So"] = 6] = "So";
    WeekDaysType[WeekDaysType["Ne"] = 7] = "Ne";
})(WeekDaysType = exports.WeekDaysType || (exports.WeekDaysType = {}));
