"use strict";
/**
 * @file SharedStudentsEntity.ts
 * @description In this file is TypeORM definition of entity sharedStudents.
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
exports.SharedStudents = void 0;
const typeorm_1 = require("typeorm");
const UnitEntity_1 = require("./UnitEntity");
let SharedStudents = class SharedStudents extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], SharedStudents.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SharedStudents.prototype, "count", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UnitEntity_1.Unit, unit => unit.unitsA),
    typeorm_1.JoinColumn({
        name: 'unitA'
    }),
    __metadata("design:type", UnitEntity_1.Unit)
], SharedStudents.prototype, "unitA", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UnitEntity_1.Unit, unit => unit.unitsB),
    typeorm_1.JoinColumn({
        name: 'unitB'
    }),
    __metadata("design:type", UnitEntity_1.Unit)
], SharedStudents.prototype, "unitB", void 0);
SharedStudents = __decorate([
    typeorm_1.Entity()
], SharedStudents);
exports.SharedStudents = SharedStudents;
