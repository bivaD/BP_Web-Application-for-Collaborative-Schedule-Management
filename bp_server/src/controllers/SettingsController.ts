/**
 * @file SettingsController.ts
 * @description This file is controller for settings.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { Settings } from "../database/SettingsEntity";

export class SettingsController {
    public static async getAllSettings(request: Request, response: Response) {
        try {
            response.json(await Settings.find());
        } catch (error) {
            console.log(error);
        }
    }
    public static async getOneSettings(request: Request, response: Response) {
        try {
            const result: Settings | null = await Settings.findOne({where: {name: request.params.name}});
            if(result == null){
                response.status(404).json('This settings name not found.')
            } else {
                response.json(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async addSettings(request: Request, response: Response) {
        try {
            var settings: Settings | null = await Settings.findOne({where: {name: request.body.name}})
            if(settings != null){
                response.status(409).json(`Nastavení s ID ${request.body.name} již existuje!`);
                return;
            }
            settings = Settings.create({
                name: request.body.name,
                value: request.body.value
            });
            settings.save();
            response.status(200).json(`Nastavení s ID ${request.body.name} úspěšně přidáno.`);   
        } catch (error) {
            console.log(error);
            response.status(409).json(`Nepodařilo se přidat nastavení!`);
        }
    }

    static async updateSettings(request: Request, response: Response) {
        try {
            var settings: Settings | null = await Settings.findOne({where: {name: request.body.name}})
            if(settings == null){
                response.status(404).json(`Nastavení s ID ${request.body.name} neexistuje!`);
                return;
            }
            settings = Settings.create({
                name: request.body.name,
                value: request.body.value
            });
            settings.save();
            response.status(200).json(`Nastavení s ID ${request.body.name} úspěšně upraveno.`);
        } catch (error) {
            console.log(error);
        }    
    }
}
