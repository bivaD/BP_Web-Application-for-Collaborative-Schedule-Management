/**
 * @file SettingsEntity.ts
 * @description In this file is TypeORM definition of entity settings.
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
} from 'typeorm';

@Entity()
export class Settings extends BaseEntity {
	@PrimaryColumn()
    name!: string;

    @Column({
        length: 2047,
    })
    value!: string;
}