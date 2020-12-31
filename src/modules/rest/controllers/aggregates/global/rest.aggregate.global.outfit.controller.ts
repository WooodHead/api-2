import {Controller, Get, Inject, Param, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import GlobalOutfitAggregateEntity from '../../../../data/entities/aggregate/global/global.outfit.aggregate.entity';
import MongoOperationsService from '../../../../../services/mongo/mongo.operations.service';
import {OptionalIntPipe} from '../../../pipes/OptionalIntPipe';
import {World} from '../../../../data/constants/world.consts';
import {ApiImplicitQueries} from 'nestjs-swagger-api-implicit-queries-decorator';
import {COMMON_IMPLICIT_QUERIES} from '../../common/rest.common.queries';
import Pagination from '../../../../../services/mongo/pagination';

@ApiTags('Global Outfit Aggregates')
@Controller('aggregates')
export default class RestGlobalOutfitAggregateController {
    constructor(
        @Inject(MongoOperationsService) private readonly mongoOperationsService: MongoOperationsService,
    ) {}

    @Get('global/outfit')
    @ApiOperation({summary: 'Return a filtered list of GlobalOutfitAggregateEntity aggregates'})
    @ApiImplicitQueries(COMMON_IMPLICIT_QUERIES)
    @ApiResponse({
        status: 200,
        description: 'The list of GlobalOutfitAggregateEntity aggregates',
        type: GlobalOutfitAggregateEntity,
        isArray: true,
    })
    async findAll(
        @Query('world', OptionalIntPipe) world?: World,
            @Query('sortBy') sortBy?: string,
            @Query('order') order?: string,
            @Query('page', OptionalIntPipe) page?: number,
            @Query('pageSize', OptionalIntPipe) pageSize?: number,
    ): Promise<GlobalOutfitAggregateEntity[]> {
        return await this.mongoOperationsService.findMany(GlobalOutfitAggregateEntity, {world}, new Pagination({sortBy, order, page, pageSize}, true));
    }

    @Get('global/outfit/:outfit')
    @ApiOperation({summary: 'Returns a GlobalOutfitAggregateEntity aggregate with given Id (or one of each world as a PS4 outfit may share the same ID as PC)'})
    @ApiImplicitQueries(COMMON_IMPLICIT_QUERIES)
    @ApiResponse({
        status: 200,
        description: 'The GlobalOutfitAggregateEntity aggregate(s)',
        type: GlobalOutfitAggregateEntity,
    })
    async findOne(
        @Param('outfit') outfit: string,
            @Query('world', OptionalIntPipe) world?: World,
            @Query('sortBy') sortBy?: string,
            @Query('order') order?: string,
            @Query('page', OptionalIntPipe) page?: number,
            @Query('pageSize', OptionalIntPipe) pageSize?: number,
    ): Promise<GlobalOutfitAggregateEntity | GlobalOutfitAggregateEntity[]> {
        return world
            ? await this.mongoOperationsService.findOne(GlobalOutfitAggregateEntity, {'outfit.id': outfit, world})
            : await this.mongoOperationsService.findMany(GlobalOutfitAggregateEntity, {'outfit.id': outfit}, new Pagination({sortBy, order, page, pageSize}, true));
    }
}
