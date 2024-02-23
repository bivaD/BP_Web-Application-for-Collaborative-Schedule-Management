/**
 * @file SubjectEntity.ts
 * @description In this file is TypeORM definition of entity subject.
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
export class Subject extends BaseEntity {
	@PrimaryColumn()
    abbreviation!: string;

	@Column()
    name!: string;

    @OneToMany(
        () => Unit,
        unit => unit.subject
    )
    units!: Unit[];
    
    @OneToMany(
        () => SuitableRoom,
        suitableRoom => suitableRoom.subject
    )
    suitableRoom!: SuitableRoom[];
}