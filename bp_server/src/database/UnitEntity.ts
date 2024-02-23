/**
 * @file UnitEntity.ts
 * @description In this file is TypeORM definition of entity unit.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import { Entity, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn } from "typeorm";
import { Lecturer } from "./LecturerEntity";
import { Room } from "./RoomEntity";
import { SharedStudents } from "./SharedStudentsEntity";
import { Subject } from "./SubjectEntity";

@Entity()
export class Unit extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    type!: number;

    @Column()
    requiredCapacity!: number;

    @Column()
    duration!: number;

    @Column({
        default: true,
    })
    periodic!: boolean;

    @Column({
        default: false,
    })
    compulsory!: boolean;

    @Column({
        default: false,
    })
    frozen!: boolean;

    @Column({
        type: "simple-array"
    })
    weeks!: number[];

    @Column()
    day!: number;

    @Column({
        default: -1,
    })
    startTime!: number;


    @ManyToOne(
        () => Subject,
        subject => subject.abbreviation
    )
    @JoinColumn({
        name: 'subject'
    })
    subject!: Subject;

    @ManyToOne(
        () => Room,
        room => room.name
    )
    @JoinColumn({
        name: 'room'
    })
    room!: Room;
    
    
    @ManyToMany(() => Lecturer, (lecturer) => lecturer.units)
    @JoinTable()
    lecturers!: Lecturer[]
    
    @OneToMany(
        () => SharedStudents,
        sharedStudents => sharedStudents.unitA
    )
    unitsA!: Unit[];

    @OneToMany(
        () => SharedStudents,
        sharedStudents => sharedStudents.unitB
    )
    unitsB!: Unit[];
}
