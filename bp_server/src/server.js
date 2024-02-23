"use strict";
/**
 * @file server.ts
 * @description In this file is main script which starts app on port 3000.
 * @author David Novák
 * @created 9. March 2023
 *
 * This code is part of a bachelor's thesis at the FIT BUT.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
App_1.default.listen(3000, (err) => {
    if (err)
        return console.log(err);
    return console.log('Server is running in port: ', 3000);
});
