"use strict";
/**
 * @file SuitableRoomEntity.ts
 * @description In this file is TypeORM definition of entity suitableRoom.
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
exports.SuitableRoom = void 0;
const typeorm_1 = require("typeorm");
const RoomEntity_1 = require("./RoomEntity");
const SubjectEntity_1 = require("./SubjectEntity");
let SuitableRoom = class SuitableRoom extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], SuitableRoom.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SuitableRoom.prototype, "unitType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => SubjectEntity_1.Subject, (subject) => subject.abbreviation),
    typeorm_1.JoinColumn({
        name: 'subject'
    }),
    __metadata("design:type", SubjectEntity_1.Subject)
], SuitableRoom.prototype, "subject", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RoomEntity_1.Room, (room) => room.units),
    typeorm_1.JoinColumn({
        name: 'room'
    }),
    __metadata("design:type", RoomEntity_1.Room)
], SuitableRoom.prototype, "room", void 0);
SuitableRoom = __decorate([
    typeorm_1.Entity()
], SuitableRoom);
exports.SuitableRoom = SuitableRoom;
