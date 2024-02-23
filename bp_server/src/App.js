"use strict";
/**
 * @file App.ts
 * @description This is main class of app with database connection and and initializing values.
 * @author David Novák
 * @created 9. March 2023
 *
 * This code is part of a bachelor's thesis at the FIT BUT.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const http = __importStar(require("http"));
const EditorActionManager_1 = require("./models/EditorActionManager");
const Routes_1 = __importDefault(require("./routes/Routes"));
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = require("socket.io");
const InitialData_1 = require("./database/InitialData");
class App {
    constructor() {
        this.app = express_1.default();
        this.app.use(cors_1.default({
            origin: '*'
        }));
        this.app.use(body_parser_1.default.json());
        this.server = http.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
        this.setupDatabase();
        this.manager = new EditorActionManager_1.EditorActionManager(this.io);
        this.setupRoutes();
        this.setupSockets();
        this.app.set('io', this.io);
        this.app.set('manager', this.manager);
    }
    setupRoutes() {
        const router = express_1.Router();
        Routes_1.default.defineRoutes(router);
        this.app.use("/", router);
    }
    setupSockets() {
        console.log("Setting up sockets");
        this.io.on("connection", (socket) => {
            console.log("User connected: " + socket.id);
            socket.on("lockUnit", (unitId) => {
                this.manager.lockUnit(unitId, socket.id);
                console.log(`[Client -> Server] lockUnit with ID ${unitId}`);
            });
            socket.on("unlockUnit", (unitId) => {
                this.manager.unlockUnit(unitId, socket.id);
                console.log(`[Client -> Server] unlockUnit with ID ${unitId}`);
            });
            socket.on("freezeUnit", (unitId) => __awaiter(this, void 0, void 0, function* () {
                yield this.manager.frozenToggle(unitId, socket.id, true);
                console.log(`[Client -> Server] freezeUnit with ID ${unitId}`);
            }));
            socket.on("unfreezeUnit", (unitId) => __awaiter(this, void 0, void 0, function* () {
                yield this.manager.frozenToggle(unitId, socket.id, false);
                console.log(`[Client -> Server] unfreezeUnit with ID ${unitId}`);
            }));
            socket.on("disconnect", () => {
                console.log(`[Client -> Server] disconnect user ${socket.id}, unlocking all his stuff.`);
                this.manager.unlockAll(socket.id);
            });
            socket.on("moveUnitToStack", (unitId) => __awaiter(this, void 0, void 0, function* () {
                console.log(`[Client -> Server] moveUnitToStack with ID ${unitId}`);
                yield this.manager.moveUnitToStack(socket.id, unitId);
            }));
            socket.on("replaceUnit", (sourceUnitId, targetUnitId, inWeek) => __awaiter(this, void 0, void 0, function* () {
                console.log(`[Client -> Server] replaceUnit ${targetUnitId} with ${sourceUnitId}`);
                yield this.manager.replaceUnit(socket.id, sourceUnitId, targetUnitId, inWeek);
            }));
            socket.on("moveUnit", (unitId, toRoom, toDay, toTime, toWeek) => __awaiter(this, void 0, void 0, function* () {
                console.log(`[Client -> Server] moveUnit with id ${unitId} to ${toRoom} at day ${toDay} on time ${toTime}`);
                yield this.manager.moveUnit(socket.id, unitId, toRoom, toDay, toTime, toWeek);
            }));
        });
    }
    setupDatabase() {
        const dataSource = new typeorm_1.DataSource({
            type: "mysql",
            host: "localhost",
            username: "root",
            password: "Ad159#cd24",
            database: "db",
            port: 3306,
            entities: ["src/database/*.js"],
            synchronize: true,
        });
        dataSource
            .initialize()
            .then(() => {
            console.log("Connected to MySQL");
            InitialData_1.InitialData.initializeDatabaseData();
            this.manager.refreshAllCollisions();
        })
            .catch((err) => {
            console.error("Error during database initialization", err);
        });
    }
}
exports.default = new App().server;
