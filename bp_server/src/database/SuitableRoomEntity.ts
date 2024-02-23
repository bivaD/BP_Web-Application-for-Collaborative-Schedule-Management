/**
 * @file SuitableRoomEntity.ts
 * @description In this file is TypeORM definition of entity suitableRoom.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import {
	Entity,
	Column,
	BaseEntity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './RoomEntity';
import { Subject } from './SubjectEntity';


@Entity()
export class SuitableRoom extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    unitType!: number;

    @ManyToOne(() => Subject, (subject) => subject.abbreviation)
    @JoinColumn({
        name: 'subject'
    })
    subject!: Subject;

    @ManyToOne(() => Room, (room) => room.units)
    @JoinColumn({
        name: 'room'
    })
    room!: Room;
}