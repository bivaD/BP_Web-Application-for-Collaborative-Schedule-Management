/**
 * @file SubjectsController.ts
 * @description This file is controller for subjects.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Request, Response } from "express";
import { SharedStudents } from "../database/SharedStudentsEntity";
import { Subject } from "../database/SubjectEntity";
import { SuitableRoom } from "../database/SuitableRoomEntity";
import { ISubjectsRowAPI } from "../interfaces/dataTypesBE";
import { EditorActionManager } from "../models/EditorActionManager";

export class SubjectsController {
    static async getAllSubjects(request: Request, response: Response) {
        try {
            var subjects = await Subject.find({relations:{
                units:true
            }});
            var subjectsApi: ISubjectsRowAPI[] = [];
            for(var subject of subjects){
                var subjectApi: ISubjectsRowAPI = {
                    abbreviation: subject.abbreviation,
                    name: subject.name,
                    unitCount: subject.units.length
                }
                subjectsApi.push(subjectApi);
            }
            response.json(subjectsApi);
        } catch (error) {
            console.log(error);
        }
    }

    static async getOneSubject(request: Request, response: Response) {
        try {
            var subject: Subject | null = await Subject.findOne({where: {abbreviation: request.params.abbreviation}})
            if(subject == null){
                response.status(404).json(`Předmět "${request.params.abbreviation}" neexistuje!`);
                return;
            }
            response.json(subject);
        } catch (error) {
            console.log(error);
        }
    }

    static async addSubject(request: Request, response: Response) {
        try {
            var subject: Subject | null = await Subject.findOne({where: {abbreviation: request.body.abbreviation}})
            if(subject != null){
                response.status(409).json(`Předmět s názvem "${request.body.abbreviation}" již existuje!`);
                return;
            }
            subject = Subject.create({
                abbreviation: request.body.abbreviation,
                name: request.body.name,
            });
            await subject.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Předmět "${request.body.abbreviation}" úspěšně přidán.`);
        } catch (error) {
            console.log(error);
        }    
    }

    static async updateSubject(request: Request, response: Response) {
        try {
            var subject: Subject | null = await Subject.findOne({where: {abbreviation: request.params.abbreviation}})
            if(subject == null){
                response.status(404).json(`Předmět s názvem "${request.params.abbreviation}" neexistuje!`);
                return;
            }
            subject.name = request.body.name ?? subject.name;
            await subject.save();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();            response.status(200).json(`Předmět "${request.params.abbreviation}" úspěšně upraven.`);
        } catch (error) {
            console.log(error);
        }    
    }

    static async deleteSubject(request: Request, response: Response) {
        try {
            var subject: Subject | null = await Subject.findOne({where: {abbreviation: request.params.abbreviation}, relations: {suitableRoom: true, units: true}})
            if(subject == null){
                response.status(404).json(`Předmět "${request.params.abbreviation}" neexistuje!`);
                return;
            }
            for(var sr of subject.suitableRoom){
                var suitableroom: SuitableRoom | null = await SuitableRoom.findOne({
                    where: { id: sr.id },
                })
                if (suitableroom == null) {
                    response.status(404).json(`Vhodná místnost s ID": ${request.body.id} neexistuje!`);
                    return;
                }
                await suitableroom.remove();
            }
            for(var unit of subject.units){
                var sharedStudents: SharedStudents[] = await SharedStudents.find({
                    where: [
                        { unitA: { id: unit.id } },
                        { unitB: { id: unit.id } },
                    ]
                });
                for(var sharedStudent of sharedStudents){
                    await sharedStudent.remove();
                }            
                await unit.remove();
            }
            await subject.remove();
            const manager: EditorActionManager = request.app.get('manager');
            manager.dataUpdated();
            response.status(200).json(`Předmět "${request.params.abbreviation}" úspěšně smazán.`);
        } catch (error) {
            console.log(error);
        }
    }
}
