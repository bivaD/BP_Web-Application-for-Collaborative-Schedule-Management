/**
 * @file CollisionsController.ts
 * @description This file is controller for collisions.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { EditorActionManager } from "../models/EditorActionManager";

export class CollisionsController {
    public static async getAllCollisions(request: Request, response: Response) {
        try {
            const manager: EditorActionManager = request.app.get('manager');
            response.json(manager.getAllCollisions());
        } catch (error) {
            console.log(error);
        }
    }
}
