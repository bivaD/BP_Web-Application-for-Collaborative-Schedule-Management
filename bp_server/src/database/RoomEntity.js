"use strict";
/**
 * @file RoomEntity.ts
 * @description In this file is TypeORM definition of entity Room.
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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const SuitableRoomEntity_1 = require("./SuitableRoomEntity");
const UnitEntity_1 = require("./UnitEntity");
let Room = class Room extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Room.prototype, "capacity", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-array'
    }),
    __metadata("design:type", Array)
], Room.prototype, "reservedHours", void 0);
__decorate([
    typeorm_1.OneToMany(() => UnitEntity_1.Unit, unit => unit.room),
    __metadata("design:type", Array)
], Room.prototype, "units", void 0);
__decorate([
    typeorm_1.OneToMany(() => SuitableRoomEntity_1.SuitableRoom, suitableRoom => suitableRoom.room),
    __metadata("design:type", Array)
], Room.prototype, "suitableRoom", void 0);
Room = __decorate([
    typeorm_1.Entity()
], Room);
exports.Room = Room;
