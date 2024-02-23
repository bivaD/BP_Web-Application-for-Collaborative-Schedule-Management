/**
 * @file CollisionStore.ts
 * @description This store is used for managing collision data.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import type { ICollision } from "@/interfaces/dataTypesFE";
import axios from "axios";
import { defineStore } from "pinia";

export const useCollisionStore = defineStore({
    id: "CollisionStore",
    state: () => ({
        collisions: [] as ICollision[],
    }),

    getters: {
        getCollisionMessages(state): string[] {
            var collisionMessages: string[] = [];
            for (var collision of state.collisions) {
                collisionMessages.push(collision.explanation);
            }
            return collisionMessages;
        },
    },
    actions: {
        fetchCollisions(){
            axios.get("http://localhost:3000/collisions")
            .then((response) => {
                this.collisions = response.data;
            })
            .catch((error) => {
                console.error(error);
            });
        },
        addCollision(collision: ICollision) {
            this.collisions.push(collision);
        },
        removedAllCollisions() {
            this.collisions = [];
        },
        removedUnitCollisions(unitId: string) {
            this.collisions = this.collisions.filter((c) => {
                return !(c.unitAId == unitId || c.unitBId == unitId)
            });
        },
        isColliding(unitId: string): boolean {
            const index: number = this.collisions.findIndex((collision) => {return collision.unitAId == unitId || collision.unitBId == unitId});
            if(index == -1){
                return false;
            } else {
                return true;
            }
        },
    },
});


