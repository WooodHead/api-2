import {Controller} from '@nestjs/common';
import {Ctx, EventPattern, Payload, RmqContext} from '@nestjs/microservices';
import InstanceDeathEntity from '../../../data/entities/instance/instance.death.entity';
import AggregatorMessageInterface from '../../interfaces/aggregator.message.interface';
import {MQAcceptedPatterns} from '../../../data/constants/MQAcceptedPatterns';
import AggregatorDataHandler from '../../aggregator.data.handler';

@Controller()
export default class AggregatorInstanceDeathEventController {
    constructor(private readonly aggregatorDataHandler: AggregatorDataHandler) {}

    @EventPattern(MQAcceptedPatterns.INSTANCE_DEATH)
    public async process(@Payload() data: AggregatorMessageInterface, @Ctx() context: RmqContext): Promise<void> {
        await this.aggregatorDataHandler.create(data, context, InstanceDeathEntity);
    }
}
