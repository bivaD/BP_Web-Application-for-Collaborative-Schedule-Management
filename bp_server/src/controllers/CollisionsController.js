"use strict";
/**
 * @file CollisionsController.ts
 * @description This file is controller for collisions.
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
exports.CollisionsController = void 0;
class CollisionsController {
    static getAllCollisions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const manager = request.app.get('manager');
                response.json(manager.getAllCollisions());
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.CollisionsController = CollisionsController;
