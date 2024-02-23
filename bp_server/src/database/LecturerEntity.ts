/**
 * @file LecturerEntity.ts
 * @description In this file is TypeORM definition of entity lecturer.
 * @author David Novák
 * @created 9. March 2023
 * 
 * This code is part of a bachelor's thesis at the FIT BUT.
 */

import {
	Entity,
	Column,
	BaseEntity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Unit } from './UnitEntity';

@Entity()
export class Lecturer extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

	@Column()
    name!: string;

	@Column()
    surname!: string;
	
    @Column()
    titlesBefore!: string;
	
    @Column()
    titlesAfter!: string;
	
    @Column({
        type: 'simple-array'
    })
    timePriorities!: number[];

    @ManyToMany(() => Unit, (unit) => unit.lecturers)
    units!: Unit[]

}