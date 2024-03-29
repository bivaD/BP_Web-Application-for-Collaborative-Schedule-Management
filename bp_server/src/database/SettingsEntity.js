"use strict";
/**
 * @file SettingsEntity.ts
 * @description In this file is TypeORM definition of entity settings.
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
exports.Settings = void 0;
const typeorm_1 = require("typeorm");
let Settings = class Settings extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Settings.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 2047,
    }),
    __metadata("design:type", String)
], Settings.prototype, "value", void 0);
Settings = __decorate([
    typeorm_1.Entity()
], Settings);
exports.Settings = Settings;
