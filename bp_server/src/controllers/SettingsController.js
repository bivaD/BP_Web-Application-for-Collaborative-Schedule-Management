"use strict";
/**
 * @file SettingsController.ts
 * @description This file is controller for settings.
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
exports.SettingsController = void 0;
const SettingsEntity_1 = require("../database/SettingsEntity");
class SettingsController {
    static getAllSettings(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                response.json(yield SettingsEntity_1.Settings.find());
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getOneSettings(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield SettingsEntity_1.Settings.findOne({ where: { name: request.params.name } });
                if (result == null) {
                    response.status(404).json('This settings name not found.');
                }
                else {
                    response.json(result);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addSettings(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var settings = yield SettingsEntity_1.Settings.findOne({ where: { name: request.body.name } });
                if (settings != null) {
                    response.status(409).json(`Nastavení s ID ${request.body.name} již existuje!`);
                    return;
                }
                settings = SettingsEntity_1.Settings.create({
                    name: request.body.name,
                    value: request.body.value
                });
                settings.save();
                response.status(200).json(`Nastavení s ID ${request.body.name} úspěšně přidáno.`);
            }
            catch (error) {
                console.log(error);
                response.status(409).json(`Nepodařilo se přidat nastavení!`);
            }
        });
    }
    static updateSettings(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var settings = yield SettingsEntity_1.Settings.findOne({ where: { name: request.body.name } });
                if (settings == null) {
                    response.status(404).json(`Nastavení s ID ${request.body.name} neexistuje!`);
                    return;
                }
                settings = SettingsEntity_1.Settings.create({
                    name: request.body.name,
                    value: request.body.value
                });
                settings.save();
                response.status(200).json(`Nastavení s ID ${request.body.name} úspěšně upraveno.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.SettingsController = SettingsController;
