/**
 * @file App.ts
 * @description This is main class of app with database connection and and initializing values.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import express, { Application, Router } from "express";
import * as http from "http";
import { EditorActionManager } from "./models/EditorActionManager";
import Routes from "./routes/Routes";
import { DataSource } from "typeorm";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./interfaces/SocketioTypesBE";
import { InitialData } from "./database/InitialData";

class App {
    public app: Application;
    public server: any;
    public manager: EditorActionManager;
    public io: Server;

    constructor() {
        this.app = express();
        this.app.use(cors({
            origin: '*'
        }));
        this.app.use(bodyParser.json());
        this.server = http.createServer(this.app);
        this.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(this.server);
        
        this.setupDatabase();
        this.manager = new EditorActionManager(this.io);

        this.setupRoutes();
        this.setupSockets();

        this.app.set('io', this.io);
        this.app.set('manager', this.manager);
    }

    private setupRoutes(): void {
        const router = Router();
        Routes.defineRoutes(router);
        this.app.use("/", router);
    }

    private setupSockets(): void {

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

            socket.on("freezeUnit", async (unitId) => {
                await this.manager.frozenToggle(unitId, socket.id, true);
                console.log(`[Client -> Server] freezeUnit with ID ${unitId}`);
            });
            socket.on("unfreezeUnit", async (unitId) => {
                await this.manager.frozenToggle(unitId, socket.id, false);
                console.log(`[Client -> Server] unfreezeUnit with ID ${unitId}`);
            });

            socket.on("disconnect", () => {
                console.log(`[Client -> Server] disconnect user ${socket.id}, unlocking all his stuff.`);
                this.manager.unlockAll(socket.id);
            });

            socket.on("moveUnitToStack", async (unitId) => {
                console.log(`[Client -> Server] moveUnitToStack with ID ${unitId}`);
                await this.manager.moveUnitToStack(socket.id, unitId);
            });
            socket.on("replaceUnit", async (sourceUnitId, targetUnitId, inWeek) => {
                console.log(`[Client -> Server] replaceUnit ${targetUnitId} with ${sourceUnitId}`);
                await this.manager.replaceUnit(socket.id, sourceUnitId, targetUnitId, inWeek);
            });
            socket.on("moveUnit", async (unitId, toRoom, toDay, toTime, toWeek) => {
                    console.log(`[Client -> Server] moveUnit with id ${unitId} to ${toRoom} at day ${toDay} on time ${toTime}`);
                    await this.manager.moveUnit(socket.id, unitId, toRoom, toDay, toTime, toWeek
                    );
                }
            );
        });
    }

    private setupDatabase(): void {
        const dataSource = new DataSource({
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
                InitialData.initializeDatabaseData();
                this.manager.refreshAllCollisions();
            })
            .catch((err) => {
                console.error("Error during database initialization", err);
            });
    }
}

export default new App().server;
