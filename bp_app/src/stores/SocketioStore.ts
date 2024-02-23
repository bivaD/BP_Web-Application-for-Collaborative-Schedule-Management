/**
 * @file SocketioStore.ts
 * @description This store is used for managing sending and recieveing Socket.IO messages.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import type { ICollision, WeekDaysType } from "@/interfaces/dataTypesFE";
import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from '@/interfaces/SocketioTypesFE';
import { defineStore } from "pinia";
import { useTimetablesStore } from "./TimetableStore";
import { useCollisionStore } from "./CollisionStore";
import { useSettingsStore } from "./SettingsStore";

export const useSocketioStore = defineStore({
    id: "SocketioStore",
    state: () => ({
        socket: io("http://localhost:3000/") as Socket<ServerToClientEvents, ClientToServerEvents>
    }),
  
    getters: {
        getSocket(state) {
            return state.socket;
        }
    },
    actions: {
        listeners(){
            var ttStore = useTimetablesStore();
            var collisionStore = useCollisionStore();
            var sstore = useSettingsStore();

            this.socket.on("connect", () => {
                console.log("Socketio connected to server :)");
            });
            this.socket.on("lockUnitDeny", (unitId: string, reason: string) => {
                console.log(`[Server -> Client] lockUnitDeny with id ${unitId} because ${reason}`);
            });
            this.socket.on("unitLocked", (unitId: string) => {
                console.log(`[Server -> Client] unitLocked with id ${unitId}`);
                ttStore.lockUnit(unitId);
            });
            this.socket.on("unitUnlocked", (unitId: string) => {
                console.log(`[Server -> Client] unitUnlocked with id ${unitId}`);
                ttStore.unlockUnit(unitId);            
            });
            //editor actions
            this.socket.on("unitMoved", (unitId: string, toRoom: string, toDay: WeekDaysType, toTime: number, toWeeks:number[]) => {
                console.log(`[Server -> Client] unitMoved with id ${unitId} to ${toRoom} at day ${toDay} on time ${toTime}`);
                ttStore.moveUnit(unitId, toRoom, toDay, toTime, toWeeks);
            });
            this.socket.on("unitMovedToStack", (unitId: string) => {
                console.log(`[Server -> Client] unitMovedToStack with id ${unitId}`);
                ttStore.moveUnitToStack(unitId);
            });
            this.socket.on("collisionAdded", (collision: ICollision) => {
                console.log(`[Server -> Client] collision added with message "${collision.explanation}"`);
                collisionStore.addCollision(collision);
            });
            this.socket.on("allCollisionsRemoved", () => {
                console.log(`[Server -> Client] all collisions removed`);
                collisionStore.removedAllCollisions();
            });
            this.socket.on("unitCollisionsRemoved", (unitId: string) => {
                console.log(`[Server -> Client] collision removed from unit with id "${unitId}"`);
                collisionStore.removedUnitCollisions(unitId);
            });
            this.socket.on("unitFrozen", (unitId: string) => {
                console.log(`[Server -> Client] unitFrozen with id ${unitId}`);
                ttStore.freezeUnit(unitId);
            });
            this.socket.on("unitUnfrozen", (unitId: string) => {
                console.log(`[Server -> Client] unitUnfrozen with id ${unitId}`);
                ttStore.unfreezeUnit(unitId);            
            });
            this.socket.on("dataUpdated", () => {
                ttStore.fetchTimetables();
                console.log(`[Server -> Client] dataUpdated`);
            });
        },
        lockUnit(unitId: string) {
            this.socket.emit("lockUnit", unitId);
            console.log(`[Client -> Server] lockUnit with ID ${unitId}`);
        },
        unlockUnit(unitId: string) {
            this.socket.emit("unlockUnit", unitId);
            console.log(`[Client -> Server] unlockUnit with ID ${unitId}`);
        },
        freezeUnit(unitId: string) {
            this.socket.emit("freezeUnit", unitId);
            console.log(`[Client -> Server] freezeUnit with ID ${unitId}`);
        },
        unfreezeUnit(unitId: string) {
            this.socket.emit("unfreezeUnit", unitId);
            console.log(`[Client -> Server] unfreezeUnit with ID ${unitId}`);
        },
    }
});

