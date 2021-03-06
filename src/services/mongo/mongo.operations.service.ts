/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */
import {CollectionAggregationOptions, MongoEntityManager, ObjectID} from 'typeorm';
import {InjectEntityManager} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import Pagination from './pagination';

@Injectable()
export default class MongoOperationsService {
    public readonly em: MongoEntityManager;

    constructor(@InjectEntityManager() em: MongoEntityManager) {
        this.em = em;
    }

    /**
     * Returns a promise that provides a single entity
     * If no filter is provided, a single entity of the type is provided
     * @param entity entity type to return
     * @param filter object provided to filter entities
     * @param pagination object handles pagination / sorting
     */
    public async findOne<T>(entity: any, filter?: any, pagination?: Pagination): Promise<T> {
        if (filter) {
            return await this.em.findOneOrFail(
                entity,
                MongoOperationsService.createFindOptions(filter, pagination),
            );
        }

        return this.em.findOneOrFail(entity);
    }

    /**
     * Returns a promise that provides a list of entities
     * If no filter is provided, all entities of the type is provided
     * @param entity entity type to return
     * @param filter object provided to filter entities
     * @param pagination object provided for sorting and pagination
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public async findMany(entity: any, filter?: object, pagination?: Pagination): Promise<any[]> {
        return await this.em.find(entity, MongoOperationsService.createFindOptions(filter, pagination));
    }

    public async insertOne(entity: any, doc: any): Promise<ObjectID> {
        doc = this.transform(doc);

        try {
            const result = await this.em.insertOne(entity, doc);

            if (result.insertedCount > 0) {
                return result.insertedId;
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            if (!error.message.includes('E11000')) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access
                throw new Error(`insertOne failed! E: ${error.message}`);
            }
        }

        throw new Error(`insertOne failed! No documents were inserted! ${JSON.stringify(doc)}`);
    }

    public async insertMany(entity: any, docs: any[]): Promise<ObjectID[]> {
        docs = this.transform(docs);

        try {
            const result = await this.em.insertMany(entity, docs);

            if (result.insertedCount > 0) {
                return result.insertedIds;
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            if (!error.message.includes('E11000')) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access
                throw new Error(`insertMany failed! E: ${error.message}`);
            }
        }

        throw new Error(`insertMany failed! No documents were inserted! ${JSON.stringify(docs)}`);
    }

    public async upsert(entity: any, docs: any[], conditionals: any[]): Promise<boolean> {
        docs = this.transform(docs);
        const operations: any[] = [];

        // Gather operations, setOnInserts etc should be first and will create the record correctly to then subsequently update.
        docs.forEach((doc) => {
            operations.push({
                updateMany: {
                    filter: conditionals[0],
                    update: doc,
                    upsert: true,
                },
            });
        });

        try {
            const result = await this.em.bulkWrite(entity, operations, {ordered: true});
            return result.upsertedCount ? result.upsertedCount > 0 : false;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            if (!error.message.includes('E11000')) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access
                throw new Error(`upsert failed! E: ${error.message}`);
            }

            return true;
        }
    }

    public aggregate <T>(entity: any, pipeline: any, options?: CollectionAggregationOptions): Promise<T[]> {
        try {
            return this.em.aggregate(entity, pipeline, options).toArray();
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access
            throw new Error(`Aggregate search failed! E: ${error.message}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private static createFindOptions(filter?: {[k: string]: any}, pagination?: Pagination): object {
        let findOptions: {[k: string]: any} = {};

        if (filter && filter !== {}) {
            Object.keys(filter).forEach((key) => (filter[key] === undefined ? delete filter[key] : {}));
            findOptions.where = filter;
        }

        if (pagination) {
            findOptions = {...findOptions, ...pagination};
        }

        return findOptions;
    }

    /* eslint-disable */
    private transform(docs: any): any {
        // Date handling
        if (docs.constructor === Array) {
            docs.map((doc: any) => {
                if (doc.hasOwnProperty('timestamp')) {
                    doc.timestamp = new Date(doc.timestamp);
                }
            });
        } else if (docs.hasOwnProperty('timestamp')) {
            docs.timestamp = new Date(docs.timestamp);
        }

        return docs;
    }
    /* eslint-enable */
}
