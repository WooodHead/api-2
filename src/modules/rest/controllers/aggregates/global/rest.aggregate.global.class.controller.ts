import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import GlobalClassAggregateEntity from '../../../../data/entities/aggregate/global/global.class.aggregate.entity';
import {World} from '../../../../data/constants/world.consts';
import {Loadout} from '../../../../data/constants/loadout.consts';
import MongoOperationsService from '../../../../../services/mongo/mongo.operations.service';

@ApiTags('Global Class Aggregates')
@Controller('aggregates')
export default class RestGlobalClassAggregateController {
    constructor(
        @Inject(MongoOperationsService) private readonly mongoOperationsService: MongoOperationsService,
    ) {}

    @Get('global/class')
    @ApiOperation({summary: 'Return a filtered list of GlobalClassAggregateEntity aggregates'})
    @ApiResponse({
        status: 200,
        description: 'The list of GlobalClassAggregateEntity aggregates',
        type: GlobalClassAggregateEntity,
        isArray: true,
    })
    async findAll(@Query('world') world?: World): Promise<GlobalClassAggregateEntity[]> {
        return world
            ? await this.mongoOperationsService.findMany(GlobalClassAggregateEntity, {world})
            : await this.mongoOperationsService.findMany(GlobalClassAggregateEntity);
    }

    @Get('global/class/:id')
    @ApiOperation({summary: 'Returns a single GlobalClassAggregateEntity aggregate by loadout ID and/or world'})
    @ApiResponse({
        status: 200,
        description: 'The GlobalClassAggregateEntity aggregate',
        type: GlobalClassAggregateEntity,
    })
    async findOne(@Param('id') id: Loadout, @Query('world') world?: World): Promise<GlobalClassAggregateEntity | GlobalClassAggregateEntity[]> {
        return world
            ? await this.mongoOperationsService.findOne(GlobalClassAggregateEntity, {class: id, world})
            : await this.mongoOperationsService.findOne(GlobalClassAggregateEntity, {class: id});
    }
}