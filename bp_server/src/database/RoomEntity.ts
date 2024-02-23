/**
 * @file RoomEntity.ts
 * @description In this file is TypeORM definition of entity Room.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import {
	Entity,
	PrimaryColumn,
	Column,
	BaseEntity,
    OneToMany,
} from 'typeorm';
import { SuitableRoom } from './SuitableRoomEntity';
import { Unit } from './UnitEntity';

@Entity()
export class Room extends BaseEntity {
	@PrimaryColumn()
    name!: string;

	@Column()
    capacity!: number;

    @Column({
        type: 'simple-array'
    })
    reservedHours!: string[];

    @OneToMany(
        () => Unit,
        unit => unit.room
    )
    units!: Unit[];


    @OneToMany(
        () => SuitableRoom,
        suitableRoom => suitableRoom.room
    )
    suitableRoom!: SuitableRoom[];
}