/* eslint-disable @typescript-eslint/explicit-member-accessibility,@typescript-eslint/naming-convention */
import {Column, ObjectIdColumn, Entity, Index, ObjectID} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {World, worldArray} from '../../../constants/world.consts';
import {Zone, zoneArray} from '../../../constants/zone.consts';
import {Bracket, bracketArray} from '../../../constants/bracket.consts';

@Entity({
    name: 'aggregate_global_victories',
})
@Index(['world', 'zone', 'date', 'bracket'], {unique: true})
@Index(['date'])
@Index(['bracket'])
export default class GlobalVictoryAggregateEntity {
    @ObjectIdColumn()
    @Exclude()
    _id: ObjectID;

    @ApiProperty({enum: worldArray, example: 10, description: 'Server / World ID'})
    @Column({
        type: 'enum',
        enum: worldArray,
    })
    world: World;

    @ApiProperty({enum: zoneArray, description: 'Zone ID'})
    @Column({
        type: 'enum',
        enum: zoneArray,
    })
    zone: Zone;

    @ApiProperty({enum: bracketArray, description: 'Bracket'})
    @Column({
        type: 'enum',
        enum: bracketArray,
    })
    bracket: Bracket;

    @ApiProperty({example: new Date(), description: 'Time the metagame instance ended in UTC'})
    @Column({
        type: 'date',
    })
    date: Date;

    @ApiProperty({example: 123, description: 'VS victories'})
    @Column({
        type: 'number',
    })
    vs: number;

    @ApiProperty({example: 123, description: 'NC victories'})
    @Column({
        type: 'number',
    })
    nc: number;

    @ApiProperty({example: 123, description: 'TR victories'})
    @Column({
        type: 'number',
    })
    tr: number;

    @ApiProperty({example: 123, description: 'Number of draws'})
    @Column({
        type: 'number',
    })
    draws: number;
}
