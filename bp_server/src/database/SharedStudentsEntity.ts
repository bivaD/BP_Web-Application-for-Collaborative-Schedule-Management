/**
 * @file SharedStudentsEntity.ts
 * @description In this file is TypeORM definition of entity sharedStudents.
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
import { Unit } from './UnitEntity';

@Entity()
export class SharedStudents extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    count!: number;

    @ManyToOne(() => Unit, unit => unit.unitsA)
    @JoinColumn({
        name: 'unitA'
    })
    unitA!: Unit;

    @ManyToOne(() => Unit, unit => unit.unitsB)
    @JoinColumn({
        name: 'unitB'
    })
    unitB!: Unit;
}