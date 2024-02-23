"use strict";
/**
 * @file LecturerEntity.ts
 * @description In this file is TypeORM definition of entity lecturer.
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
exports.Lecturer = void 0;
const typeorm_1 = require("typeorm");
const UnitEntity_1 = require("./UnitEntity");
let Lecturer = class Lecturer extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Lecturer.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Lecturer.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Lecturer.prototype, "surname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Lecturer.prototype, "titlesBefore", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Lecturer.prototype, "titlesAfter", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-array'
    }),
    __metadata("design:type", Array)
], Lecturer.prototype, "timePriorities", void 0);
__decorate([
    typeorm_1.ManyToMany(() => UnitEntity_1.Unit, (unit) => unit.lecturers),
    __metadata("design:type", Array)
], Lecturer.prototype, "units", void 0);
Lecturer = __decorate([
    typeorm_1.Entity()
], Lecturer);
exports.Lecturer = Lecturer;
