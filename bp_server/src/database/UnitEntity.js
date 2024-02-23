"use strict";
/**
 * @file UnitEntity.ts
 * @description In this file is TypeORM definition of entity unit.
 * @author David Novák
 * @created 9. March 2023
 *
 * This code is part of a bachelor's thesis at the FIT BUT.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const typeorm_1 = require("typeorm");
const LecturerEntity_1 = require("./LecturerEntity");
const RoomEntity_1 = require("./RoomEntity");
const SharedStudentsEntity_1 = require("./SharedStudentsEntity");
const SubjectEntity_1 = require("./SubjectEntity");
let Unit = class Unit extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Unit.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Unit.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Unit.prototype, "requiredCapacity", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Unit.prototype, "duration", void 0);
__decorate([
    typeorm_1.Column({
        default: true,
    }),
    __metadata("design:type", Boolean)
], Unit.prototype, "periodic", void 0);
__decorate([
    typeorm_1.Column({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Unit.prototype, "compulsory", void 0);
__decorate([
    typeorm_1.Column({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Unit.prototype, "frozen", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array"
    }),
    __metadata("design:type", Array)
], Unit.prototype, "weeks", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Unit.prototype, "day", void 0);
__decorate([
    typeorm_1.Column({
        default: -1,
    }),
    __metadata("design:type", Number)
], Unit.prototype, "startTime", void 0);
__decorate([
    typeorm_1.ManyToOne(() => SubjectEntity_1.Subject, subject => subject.abbreviation),
    typeorm_1.JoinColumn({
        name: 'subject'
    }),
    __metadata("design:type", SubjectEntity_1.Subject)
], Unit.prototype, "subject", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RoomEntity_1.Room, room => room.name),
    typeorm_1.JoinColumn({
        name: 'room'
    }),
    __metadata("design:type", RoomEntity_1.Room)
], Unit.prototype, "room", void 0);
__decorate([
    typeorm_1.ManyToMany(() => LecturerEntity_1.Lecturer, (lecturer) => lecturer.units),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Unit.prototype, "lecturers", void 0);
__decorate([
    typeorm_1.OneToMany(() => SharedStudentsEntity_1.SharedStudents, sharedStudents => sharedStudents.unitA),
    __metadata("design:type", Array)
], Unit.prototype, "unitsA", void 0);
__decorate([
    typeorm_1.OneToMany(() => SharedStudentsEntity_1.SharedStudents, sharedStudents => sharedStudents.unitB),
    __metadata("design:type", Array)
], Unit.prototype, "unitsB", void 0);
Unit = __decorate([
    typeorm_1.Entity()
], Unit);
exports.Unit = Unit;
