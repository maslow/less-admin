
export const mongodb_declare = `
// Type definitions for MongoDB 3.6
// Project: https://github.com/mongodb/node-mongodb-native
//          https://github.com/mongodb/node-mongodb-native/tree/3.1
// Definitions by: Federico Caselli <https://github.com/CaselIT>
//                 Alan Marcell <https://github.com/alanmarcell>
//                 Gaurav Lahoti <https://github.com/dante-101>
//                 Mariano Cortesi <https://github.com/mcortesi>
//                 Enrico Picci <https://github.com/EnricoPicci>
//                 Alexander Christie <https://github.com/AJCStriker>
//                 Julien Chaumond <https://github.com/julien-c>
//                 Dan Aprahamian <https://github.com/daprahamian>
//                 Denys Bushulyak <https://github.com/denys-bushulyak>
//                 Bastien Arata <https://github.com/BastienAr>
//                 Wan Bachtiar <https://github.com/sindbach>
//                 Geraldine Lemeur <https://github.com/geraldinelemeur>
//                 Dominik Heigl <https://github.com/various89>
//                 Angela-1 <https://github.com/angela-1>
//                 Hector Ribes <https://github.com/hector7>
//                 Florian Richter <https://github.com/floric>
//                 Erik Christensen <https://github.com/erikc5000>
//                 Nick Zahn <https://github.com/Manc>
//                 Jarom Loveridge <https://github.com/jloveridge>
//                 Luis Pais <https://github.com/ranguna>
//                 Hossein Saniei <https://github.com/HosseinAgha>
//                 Alberto Silva <https://github.com/albertossilva>
//                 Piotr Błażejewicz <https://github.com/peterblazejewicz>
//                 Linus Unnebäck <https://github.com/LinusU>
//                 Richard Bateman <https://github.com/taxilian>
//                 Igor Strebezhev <https://github.com/xamgore>
//                 Valentin Agachi <https://github.com/avaly>
//                 HitkoDev <https://github.com/HitkoDev>
//                 TJT <https://github.com/Celend>
//                 Julien TASSIN <https://github.com/jtassin>
//                 Anna Henningsen <https://github.com/addaleax>
//                 Emmanuel Gautier <https://github.com/emmanuelgautier>
//                 Wyatt Johnson <https://github.com/wyattjoh>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.2

// Documentation: https://mongodb.github.io/node-mongodb-native/3.6/api/

/// <reference types="node" />
/// <reference lib="esnext.asynciterable" />

import { Binary, Decimal128, Double, Int32, Long, ObjectId, Timestamp } from 'bson';
import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';
import { checkServerIdentity } from 'tls';

type FlattenIfArray<T> = T extends ReadonlyArray<infer R> ? R : T;
export type WithoutProjection<T> = T & { fields?: undefined; projection?: undefined };

export function connect(uri: string, options?: MongoClientOptions): Promise<MongoClient>;
export function connect(uri: string, callback: MongoCallback<MongoClient>): void;
export function connect(uri: string, options: MongoClientOptions, callback: MongoCallback<MongoClient>): void;

export { Binary, DBRef, Decimal128, Double, Int32, Long, MaxKey, MinKey, ObjectID, ObjectId, Timestamp } from 'bson';

type NumericTypes = number | Decimal128 | Double | Int32 | Long;


export class MongoClient extends EventEmitter {
    constructor(uri: string, options?: MongoClientOptions);
    
    static connect(uri: string, callback: MongoCallback<MongoClient>): void;
    static connect(uri: string, options?: MongoClientOptions): Promise<MongoClient>;
    static connect(uri: string, options: MongoClientOptions, callback: MongoCallback<MongoClient>): void;
    
    connect(): Promise<MongoClient>;
    connect(callback: MongoCallback<MongoClient>): void;
    
    close(callback: MongoCallback<void>): void;
    close(force?: boolean): Promise<void>;
    close(force: boolean, callback: MongoCallback<void>): void;
    
    db(dbName?: string, options?: MongoClientCommonOption): Db;
    
    isConnected(options?: MongoClientCommonOption): boolean;
    
    logout(callback: MongoCallback<any>): void;
    logout(options?: { dbName?: string }): Promise<any>;
    logout(options: { dbName?: string }, callback: MongoCallback<any>): void;
    
    startSession(options?: SessionOptions): ClientSession;
    
    watch<TSchema extends object = { _id: ObjectId }>(
        pipeline?: object[],
        options?: ChangeStreamOptions & { session?: ClientSession },
    ): ChangeStream<TSchema>;
    
    withSession(operation: (session: ClientSession) => Promise<any>): Promise<void>;
    
    withSession(options: SessionOptions, operation: (session: ClientSession) => Promise<any>): Promise<void>;

    readPreference: ReadPreference;
    writeConcern: WriteConcern;
}

export type ClientSessionId = unknown;


export interface ClientSession extends EventEmitter {
    
    id: ClientSessionId;

    
    abortTransaction(): Promise<void>;
    
    abortTransaction(callback?: MongoCallback<void>): void;

    
    advanceOperationTime(operationTime: Timestamp): void;

    
    commitTransaction(): Promise<void>;
    
    commitTransaction(callback: MongoCallback<void>): void;

    
    endSession(callback?: MongoCallback<void>): void;
    
    endSession(options: unknown, callback: MongoCallback<void>): void;
    
    endSession(options?: unknown): Promise<void>;

    
    equals(session: ClientSession): boolean;

    
    incrementTransactionNumber(): void;

    
    inTransaction(): boolean;

    
    startTransaction(options?: TransactionOptions): void;

    
    withTransaction<T>(fn: WithTransactionCallback<T>, options?: TransactionOptions): Promise<void>;
}


type ReadConcernLevel = 'local' | 'available' | 'majority' | 'linearizable' | 'snapshot';


export interface ReadConcern {
    level: ReadConcernLevel;
}


interface WriteConcern {
    
    w?: number | 'majority' | string;
    
    j?: boolean;
    
    wtimeout?: number;
}


export interface SessionOptions {
    
    causalConsistency?: boolean;
    
    defaultTransactionOptions?: TransactionOptions;
}


export interface TransactionOptions {
    readConcern?: ReadConcern;
    writeConcern?: WriteConcern;
    readPreference?: ReadPreferenceOrMode;
}

export interface MongoClientCommonOption {
    
    noListener?: boolean;
    
    returnNonCachedInstance?: boolean;
}

export interface MongoCallback<T> {
    (error: MongoError, result: T): void;
}


export type WithTransactionCallback<T> = (session: ClientSession) => Promise<T>;


export class MongoError extends Error {
    constructor(message: string | Error | object);
    
    static create(options: string | Error | object): MongoError;
    
    hasErrorLabel(label: string): boolean;
    readonly errorLabels: string[];
    code?: number | string;
    
    errmsg?: string;
    name: string;
}


export class MongoNetworkError extends MongoError {}


export class MongoParseError extends MongoError {}


export class MongoTimeoutError extends MongoError {
    
    reason?: string | object;
}


export class MongoServerSelectionError extends MongoTimeoutError {}


export class MongoWriteConcernError extends MongoError {
    
    result?: object;
}


export interface MongoClientOptions
    extends DbCreateOptions,
        ServerOptions,
        MongosOptions,
        ReplSetOptions,
        SocketOptions,
        SSLOptions,
        TLSOptions,
        HighAvailabilityOptions,
        WriteConcern,
        UnifiedTopologyOptions {
    
    loggerLevel?: string;

    
    logger?: object | log;

    
    validateOptions?: object | boolean;

    
    appname?: string;

    
    auth?: {
        
        user: string;
        
        password: string;
    };

    
    useNewUrlParser?: boolean;

    
    numberOfRetries?: number;

    
    authMechanism?:
        | 'DEFAULT'
        | 'GSSAPI'
        | 'PLAIN'
        | 'MONGODB-X509'
        | 'MONGODB-CR'
        | 'MONGODB-AWS'
        | 'SCRAM-SHA-1'
        | 'SCRAM-SHA-256'
        | string;

    
    compression?: {
        
        compressors?: Array<'snappy' | 'zlib'>;
    };

    
    directConnection?: boolean;

    
    autoEncryption?: AutoEncryptionOptions;
}


export interface AutoEncryptionExtraOptions {
    
    mongocryptdURI?: string;

    
    mongocryptdBypassSpawn?: boolean;

    
    mongocryptdSpawnPath?: string;

    
    mongocryptdSpawnArgs?: string[];
}


export interface KMSProviders {
    
    aws?: {
        
        accessKeyId?: string;

        
        secretAccessKey?: string;
    };

    
    gcp?: {
        
        email?: string;

        
        privateKey?: string | Buffer;

        
        endpoint?: string;
    };

    
    local?: {
        
        key?: Buffer;
    };
}


export interface AutoEncryptionOptions {
    
    keyVaultClient?: MongoClient;

    
    keyVaultNamespace?: string;

    
    kmsProviders?: KMSProviders;

    
    schemaMap?: object;

    
    bypassAutoEncryption?: boolean;

    
    extraOptions?: AutoEncryptionExtraOptions;
}

export interface SSLOptions {
    
    ciphers?: string;
    
    ecdhCurve?: string;
    
    poolSize?: number;
    
    minSize?: number;
    
    ssl?: boolean;
    
    sslValidate?: boolean;
    
    checkServerIdentity?: boolean | typeof checkServerIdentity;
    
    sslCA?: ReadonlyArray<Buffer | string>;
    
    sslCRL?: ReadonlyArray<Buffer | string>;
    
    sslCert?: Buffer | string;
    
    sslKey?: Buffer | string;
    
    sslPass?: Buffer | string;
    
    servername?: string;
}

export interface TLSOptions {
    
    tls?: boolean;
    
    tlsInsecure?: boolean;
    
    tlsCAFile?: string;
    
    tlsCertificateKeyFile?: string;
    
    tlsCertificateKeyFilePassword?: string;
    
    tlsAllowInvalidCertificates?: boolean;
    
    tlsAllowInvalidHostnames?: boolean;
}

export interface HighAvailabilityOptions {
    
    ha?: boolean;
    
    haInterval?: number;
    
    domainsEnabled?: boolean;

    
    readPreference?: ReadPreferenceOrMode;
    
    readPreferenceTags?: ReadPreferenceTags;
}

export type ReadPreferenceTags = ReadonlyArray<Record<string, string>>;
export type ReadPreferenceMode = 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest';
export type ReadPreferenceOrMode = ReadPreference | ReadPreferenceMode;
export type ReadPreferenceOptions = {
    
    hedge?: {
        
        enabled?: boolean;
    };
    
    maxStalenessSeconds?: number;
};


export class ReadPreference {
    constructor(mode: ReadPreferenceMode, tags: object, options?: ReadPreferenceOptions);
    mode: ReadPreferenceMode;
    tags: ReadPreferenceTags;
    static PRIMARY: 'primary';
    static PRIMARY_PREFERRED: 'primaryPreferred';
    static SECONDARY: 'secondary';
    static SECONDARY_PREFERRED: 'secondaryPreferred';
    static NEAREST: 'nearest';
    isValid(mode: ReadPreferenceMode | string): boolean;
    static isValid(mode: string): boolean;
    
    slaveOk(): boolean;
    
    equals(readPreference: ReadPreference): boolean;
}


export interface DbCreateOptions extends CommonOptions {
    
    authSource?: string;
    
    forceServerObjectId?: boolean;
    
    native_parser?: boolean;
    
    serializeFunctions?: boolean;
    
    ignoreUndefined?: boolean;
    
    raw?: boolean;
    
    promoteLongs?: boolean;
    
    promoteBuffers?: boolean;
    
    promoteValues?: boolean;
    
    readPreference?: ReadPreferenceOrMode;
    
    pkFactory?: object;
    
    promiseLibrary?: PromiseConstructor;
    
    readConcern?: ReadConcern | string;
    
    bufferMaxEntries?: number;
}

export interface UnifiedTopologyOptions {
    
    useUnifiedTopology?: boolean;

    
    localThresholdMS?: number;

    
    serverSelectionTimeoutMS?: number;

    
    heartbeatFrequencyMS?: number;

    
    maxPoolSize?: number;

    
    minPoolSize?: number;

    
    maxIdleTimeMS?: number;

    
    waitQueueTimeoutMS?: number;
}


export interface SocketOptions {
    
    autoReconnect?: boolean;
    
    noDelay?: boolean;
    
    keepAlive?: boolean;
    
    keepAliveInitialDelay?: number;
    
    connectTimeoutMS?: number;
    
    family?: 4 | 6 | null;
    
    socketTimeoutMS?: number;
}


export interface ServerOptions extends SSLOptions {
    
    reconnectTries?: number;
    
    reconnectInterval?: number;
    
    monitoring?: boolean;

    
    monitorCommands?: boolean;

    
    socketOptions?: SocketOptions;

    
    haInterval?: number;
    
    domainsEnabled?: boolean;

    
    fsync?: boolean;
}


export interface MongosOptions extends SSLOptions, HighAvailabilityOptions {
    
    acceptableLatencyMS?: number;

    
    socketOptions?: SocketOptions;
}


export interface ReplSetOptions extends SSLOptions, HighAvailabilityOptions {
    
    maxStalenessSeconds?: number;
    
    replicaSet?: string;
    
    secondaryAcceptableLatencyMS?: number;
    connectWithNoPrimary?: boolean;
    socketOptions?: SocketOptions;
}

export type ProfilingLevel = 'off' | 'slow_only' | 'all';


export class Db extends EventEmitter {
    constructor(databaseName: string, serverConfig: Server | ReplSet | Mongos, options?: DbCreateOptions);

    serverConfig: Server | ReplSet | Mongos;
    bufferMaxEntries: number;
    databaseName: string;
    options: any;
    native_parser: boolean;
    slaveOk: boolean;
    writeConcern: WriteConcern;

    
    addUser(username: string, password: string, callback: MongoCallback<any>): void;
    addUser(username: string, password: string, options?: DbAddUserOptions): Promise<any>;
    addUser(username: string, password: string, options: DbAddUserOptions, callback: MongoCallback<any>): void;
    
    admin(): Admin;
    
    collection<TSchema = DefaultSchema>(
        name: string,
        callback?: MongoCallback<Collection<TSchema>>,
    ): Collection<TSchema>;
    collection<TSchema = DefaultSchema>(
        name: string,
        options: DbCollectionOptions,
        callback?: MongoCallback<Collection<TSchema>>,
    ): Collection<TSchema>;
    
    collections(): Promise<Array<Collection<Default>>>;
    collections(callback: MongoCallback<Array<Collection<Default>>>): void;
    
    command(command: object, callback: MongoCallback<any>): void;
    command(
        command: object,
        options?: { readPreference?: ReadPreferenceOrMode; session?: ClientSession },
    ): Promise<any>;
    command(
        command: object,
        options: { readPreference: ReadPreferenceOrMode; session?: ClientSession },
        callback: MongoCallback<any>,
    ): void;
    
    createCollection<TSchema = DefaultSchema>(name: string, callback: MongoCallback<Collection<TSchema>>): void;
    createCollection<TSchema = DefaultSchema>(
        name: string,
        options?: CollectionCreateOptions,
    ): Promise<Collection<TSchema>>;
    createCollection<TSchema = DefaultSchema>(
        name: string,
        options: CollectionCreateOptions,
        callback: MongoCallback<Collection<TSchema>>,
    ): void;
    
    createIndex(name: string, fieldOrSpec: string | object, callback: MongoCallback<any>): void;
    createIndex(name: string, fieldOrSpec: string | object, options?: IndexOptions): Promise<any>;
    createIndex(name: string, fieldOrSpec: string | object, options: IndexOptions, callback: MongoCallback<any>): void;
    
    dropCollection(name: string): Promise<boolean>;
    dropCollection(name: string, callback: MongoCallback<boolean>): void;
    
    dropDatabase(): Promise<any>;
    dropDatabase(callback: MongoCallback<any>): void;
    
    executeDbAdminCommand(command: object, callback: MongoCallback<any>): void;
    executeDbAdminCommand(
        command: object,
        options?: { readPreference?: ReadPreferenceOrMode; session?: ClientSession },
    ): Promise<any>;
    executeDbAdminCommand(
        command: object,
        options: { readPreference?: ReadPreferenceOrMode; session?: ClientSession },
        callback: MongoCallback<any>,
    ): void;
    
    indexInformation(name: string, callback: MongoCallback<any>): void;
    indexInformation(name: string, options?: { full?: boolean; readPreference?: ReadPreferenceOrMode }): Promise<any>;
    indexInformation(
        name: string,
        options: { full?: boolean; readPreference?: ReadPreferenceOrMode },
        callback: MongoCallback<any>,
    ): void;
    
    listCollections(
        filter?: object,
        options?: {
            nameOnly?: boolean;
            batchSize?: number;
            readPreference?: ReadPreferenceOrMode;
            session?: ClientSession;
        },
    ): CommandCursor;
    
    
    profilingInfo(callback: MongoCallback<any>): void;
    profilingInfo(options?: { session?: ClientSession }): Promise<void>;
    profilingInfo(options: { session?: ClientSession }, callback: MongoCallback<void>): void;
    
    profilingLevel(callback: MongoCallback<ProfilingLevel>): void;
    profilingLevel(options?: { session?: ClientSession }): Promise<ProfilingLevel>;
    profilingLevel(options: { session?: ClientSession }, callback: MongoCallback<ProfilingLevel>): void;
    
    removeUser(username: string, callback: MongoCallback<any>): void;
    removeUser(username: string, options?: CommonOptions): Promise<any>;
    removeUser(username: string, options: CommonOptions, callback: MongoCallback<any>): void;
    
    renameCollection<TSchema = DefaultSchema>(
        fromCollection: string,
        toCollection: string,
        callback: MongoCallback<Collection<TSchema>>,
    ): void;
    renameCollection<TSchema = DefaultSchema>(
        fromCollection: string,
        toCollection: string,
        options?: { dropTarget?: boolean },
    ): Promise<Collection<TSchema>>;
    renameCollection<TSchema = DefaultSchema>(
        fromCollection: string,
        toCollection: string,
        options: { dropTarget?: boolean },
        callback: MongoCallback<Collection<TSchema>>,
    ): void;
    
    setProfilingLevel(level: ProfilingLevel, callback: MongoCallback<ProfilingLevel>): void;
    setProfilingLevel(level: ProfilingLevel, options?: { session?: ClientSession }): Promise<ProfilingLevel>;
    setProfilingLevel(
        level: ProfilingLevel,
        options: { session?: ClientSession },
        callback: MongoCallback<ProfilingLevel>,
    ): void;
    
    stats(callback: MongoCallback<any>): void;
    stats(options?: { scale?: number }): Promise<any>;
    stats(options: { scale?: number }, callback: MongoCallback<any>): void;
    
    watch<TSchema extends object = { _id: ObjectId }>(
        pipeline?: object[],
        options?: ChangeStreamOptions & { session?: ClientSession },
    ): ChangeStream<TSchema>;
}

export interface CommonOptions extends WriteConcern {
    session?: ClientSession;
}


export class Server extends EventEmitter {
    constructor(host: string, port: number, options?: ServerOptions);

    connections(): any[];
}


export class ReplSet extends EventEmitter {
    constructor(servers: Server[], options?: ReplSetOptions);

    connections(): any[];
}


export class Mongos extends EventEmitter {
    constructor(servers: Server[], options?: MongosOptions);

    connections(): any[];
}


export interface DbAddUserOptions extends CommonOptions {
    customData?: object;
    roles?: object[];
}


export interface CollectionCreateOptions extends CommonOptions {
    raw?: boolean;
    pkFactory?: object;
    readPreference?: ReadPreferenceOrMode;
    serializeFunctions?: boolean;
    
    strict?: boolean;
    capped?: boolean;
    
    autoIndexId?: boolean;
    size?: number;
    max?: number;
    flags?: number;
    storageEngine?: object;
    validator?: object;
    validationLevel?: 'off' | 'strict' | 'moderate';
    validationAction?: 'error' | 'warn';
    indexOptionDefaults?: object;
    viewOn?: string;
    pipeline?: any[];
    collation?: CollationDocument;
}


export interface DbCollectionOptions extends CommonOptions {
    raw?: boolean;
    pkFactory?: object;
    readPreference?: ReadPreferenceOrMode;
    serializeFunctions?: boolean;
    strict?: boolean;
    readConcern?: ReadConcern;
}


export interface IndexOptions extends CommonOptions {
    
    unique?: boolean;
    
    sparse?: boolean;
    
    background?: boolean;
    
    dropDups?: boolean;
    
    min?: number;
    
    max?: number;
    
    v?: number;
    
    expireAfterSeconds?: number;
    
    name?: string;
    
    partialFilterExpression?: any;
    collation?: CollationDocument;
    default_language?: string;
}


export interface Admin {
    
    addUser(username: string, password: string, callback: MongoCallback<any>): void;
    addUser(username: string, password: string, options?: AddUserOptions): Promise<any>;
    addUser(username: string, password: string, options: AddUserOptions, callback: MongoCallback<any>): void;
    
    buildInfo(options?: { session?: ClientSession }): Promise<any>;
    buildInfo(options: { session?: ClientSession }, callback: MongoCallback<any>): void;
    buildInfo(callback: MongoCallback<any>): void;
    
    command(command: object, callback: MongoCallback<any>): void;
    command(command: object, options?: { readPreference?: ReadPreferenceOrMode; maxTimeMS?: number }): Promise<any>;
    command(
        command: object,
        options: { readPreference?: ReadPreferenceOrMode; maxTimeMS?: number },
        callback: MongoCallback<any>,
    ): void;
    
    listDatabases(options?: { nameOnly?: boolean; session?: ClientSession }): Promise<any>;
    listDatabases(options: { nameOnly?: boolean; session?: ClientSession }, callback: MongoCallback<any>): void;
    listDatabases(callback: MongoCallback<any>): void;
    
    ping(options?: { session?: ClientSession }): Promise<any>;
    ping(options: { session?: ClientSession }, callback: MongoCallback<any>): void;
    ping(callback: MongoCallback<any>): void;
    
    removeUser(username: string, callback: MongoCallback<any>): void;
    removeUser(username: string, options?: FSyncOptions): Promise<any>;
    removeUser(username: string, options: FSyncOptions, callback: MongoCallback<any>): void;
    
    replSetGetStatus(options?: { session?: ClientSession }): Promise<any>;
    replSetGetStatus(options: { session?: ClientSession }, callback: MongoCallback<any>): void;
    replSetGetStatus(callback: MongoCallback<any>): void;
    
    serverInfo(): Promise<any>;
    serverInfo(callback: MongoCallback<any>): void;
    
    serverStatus(options?: { session?: ClientSession }): Promise<any>;
    serverStatus(options: { session?: ClientSession }, callback: MongoCallback<any>): void;
    serverStatus(callback: MongoCallback<any>): void;
    
    validateCollection(collectionNme: string, callback: MongoCallback<any>): void;
    validateCollection(collectionNme: string, options?: object): Promise<any>;
    validateCollection(collectionNme: string, options: object, callback: MongoCallback<any>): void;
}


export interface AddUserOptions extends CommonOptions {
    fsync: boolean;
    customData?: object;
    roles?: object[];
}


export interface FSyncOptions extends CommonOptions {
    fsync?: boolean;
}

// TypeScript Omit (Exclude to be specific) does not work for objects with an "any" indexed type, and breaks discriminated unions
type EnhancedOmit<T, K> = string | number extends keyof T
    ? T // T has indexed type e.g. { _id: string; [k: string]: any; } or it is "any"
    : T extends any
    ? Pick<T, Exclude<keyof T, K>> // discriminated unions
    : never;

type ExtractIdType<TSchema> = TSchema extends { _id: infer U } // user has defined a type for _id
    ? {} extends U
        ? Exclude<U, {}>
        : unknown extends U
        ? ObjectId
        : U
    : ObjectId; // user has not defined _id on schema

// this makes _id optional
export type OptionalId<TSchema extends { _id?: any }> = ObjectId extends TSchema['_id']
    ? // a Schema with ObjectId _id type or "any" or "indexed type" provided
      EnhancedOmit<TSchema, '_id'> & { _id?: ExtractIdType<TSchema> }
    : // a Schema provided but _id type is not ObjectId
      WithId<TSchema>;

// this adds _id as a required property
export type WithId<TSchema> = EnhancedOmit<TSchema, '_id'> & { _id: ExtractIdType<TSchema> };


export interface Collection<TSchema extends { [key: string]: any } = DefaultSchema> {
    
    collectionName: string;
    
    namespace: string;
    
    writeConcern: WriteConcern;
    
    readConcern: ReadConcern;
    
    hint: any;
    
    aggregate<T = TSchema>(callback: MongoCallback<AggregationCursor<T>>): AggregationCursor<T>;
    aggregate<T = TSchema>(pipeline: object[], callback: MongoCallback<AggregationCursor<T>>): AggregationCursor<T>;
    aggregate<T = TSchema>(
        pipeline?: object[],
        options?: CollectionAggregationOptions,
        callback?: MongoCallback<AggregationCursor<T>>,
    ): AggregationCursor<T>;
    
    bulkWrite(operations: Array<BulkWriteOperation<TSchema>>, callback: MongoCallback<BulkWriteOpResultObject>): void;
    bulkWrite(
        operations: Array<BulkWriteOperation<TSchema>>,
        options?: CollectionBulkWriteOptions,
    ): Promise<BulkWriteOpResultObject>;
    bulkWrite(
        operations: Array<BulkWriteOperation<TSchema>>,
        options: CollectionBulkWriteOptions,
        callback: MongoCallback<BulkWriteOpResultObject>,
    ): void;
    
    count(callback: MongoCallback<number>): void;
    count(query: FilterQuery<TSchema>, callback: MongoCallback<number>): void;
    count(query?: FilterQuery<TSchema>, options?: MongoCountPreferences): Promise<number>;
    count(query: FilterQuery<TSchema>, options: MongoCountPreferences, callback: MongoCallback<number>): void;
    
    countDocuments(callback: MongoCallback<number>): void;
    countDocuments(query: FilterQuery<TSchema>, callback: MongoCallback<number>): void;
    countDocuments(query?: FilterQuery<TSchema>, options?: MongoCountPreferences): Promise<number>;
    countDocuments(query: FilterQuery<TSchema>, options: MongoCountPreferences, callback: MongoCallback<number>): void;
    
    createIndex(fieldOrSpec: string | any, callback: MongoCallback<string>): void;
    createIndex(fieldOrSpec: string | any, options?: IndexOptions): Promise<string>;
    createIndex(fieldOrSpec: string | any, options: IndexOptions, callback: MongoCallback<string>): void;
    
    createIndexes(indexSpecs: IndexSpecification[], callback: MongoCallback<any>): void;
    createIndexes(indexSpecs: IndexSpecification[], options?: { session?: ClientSession }): Promise<any>;
    createIndexes(
        indexSpecs: IndexSpecification[],
        options: { session?: ClientSession },
        callback: MongoCallback<any>,
    ): void;
    
    deleteMany(filter: FilterQuery<TSchema>, callback: MongoCallback<DeleteWriteOpResultObject>): void;
    deleteMany(filter: FilterQuery<TSchema>, options?: CommonOptions): Promise<DeleteWriteOpResultObject>;
    deleteMany(
        filter: FilterQuery<TSchema>,
        options: CommonOptions,
        callback: MongoCallback<DeleteWriteOpResultObject>,
    ): void;
    
    deleteOne(filter: FilterQuery<TSchema>, callback: MongoCallback<DeleteWriteOpResultObject>): void;
    deleteOne(
        filter: FilterQuery<TSchema>,
        options?: CommonOptions & { bypassDocumentValidation?: boolean },
    ): Promise<DeleteWriteOpResultObject>;
    deleteOne(
        filter: FilterQuery<TSchema>,
        options: CommonOptions & { bypassDocumentValidation?: boolean },
        callback: MongoCallback<DeleteWriteOpResultObject>,
    ): void;
    
    distinct<Key extends keyof WithId<TSchema>>(
        key: Key,
        callback: MongoCallback<Array<FlattenIfArray<WithId<TSchema>[Key]>>>,
    ): void;
    distinct<Key extends keyof WithId<TSchema>>(
        key: Key,
        query: FilterQuery<TSchema>,
        callback: MongoCallback<Array<FlattenIfArray<WithId<TSchema>[Key]>>>,
    ): void;
    distinct<Key extends keyof WithId<TSchema>>(
        key: Key,
        query?: FilterQuery<TSchema>,
        options?: MongoDistinctPreferences,
    ): Promise<Array<FlattenIfArray<WithId<TSchema>[Key]>>>;
    distinct<Key extends keyof WithId<TSchema>>(
        key: Key,
        query: FilterQuery<TSchema>,
        options: MongoDistinctPreferences,
        callback: MongoCallback<Array<FlattenIfArray<WithId<TSchema>[Key]>>>,
    ): void;
    distinct(key: string, callback: MongoCallback<any[]>): void;
    distinct(key: string, query: FilterQuery<TSchema>, callback: MongoCallback<any[]>): void;
    distinct(key: string, query?: FilterQuery<TSchema>, options?: MongoDistinctPreferences): Promise<any[]>;
    distinct(
        key: string,
        query: FilterQuery<TSchema>,
        options: MongoDistinctPreferences,
        callback: MongoCallback<any[]>,
    ): void;
    
    drop(options?: { session: ClientSession }): Promise<any>;
    drop(callback: MongoCallback<any>): void;
    drop(options: { session: ClientSession }, callback: MongoCallback<any>): void;
    
    dropIndex(indexName: string, callback: MongoCallback<any>): void;
    dropIndex(indexName: string, options?: CommonOptions & { maxTimeMS?: number }): Promise<any>;
    dropIndex(indexName: string, options: CommonOptions & { maxTimeMS?: number }, callback: MongoCallback<any>): void;
    
    dropIndexes(options?: { session?: ClientSession; maxTimeMS?: number }): Promise<any>;
    dropIndexes(callback?: MongoCallback<any>): void;
    dropIndexes(options: { session?: ClientSession; maxTimeMS?: number }, callback: MongoCallback<any>): void;
    
    estimatedDocumentCount(callback: MongoCallback<number>): void;
    estimatedDocumentCount(query: FilterQuery<TSchema>, callback: MongoCallback<number>): void;
    estimatedDocumentCount(query?: FilterQuery<TSchema>, options?: MongoCountPreferences): Promise<number>;
    estimatedDocumentCount(
        query: FilterQuery<TSchema>,
        options: MongoCountPreferences,
        callback: MongoCallback<number>,
    ): void;
    
    find(query?: FilterQuery<TSchema>): Cursor<TSchema>;
    find(query: FilterQuery<TSchema>, options?: WithoutProjection<FindOneOptions<TSchema>>): Cursor<TSchema>;
    find<T = TSchema>(query: FilterQuery<TSchema>, options: FindOneOptions<T extends TSchema ? TSchema : T>): Cursor<T>;
    
    findOne(filter: FilterQuery<TSchema>, callback: MongoCallback<TSchema>): void;
    findOne(
        filter: FilterQuery<TSchema>,
        options?: WithoutProjection<FindOneOptions<TSchema>>,
    ): Promise<TSchema | null>;
    findOne<T = TSchema>(
        filter: FilterQuery<TSchema>,
        options?: FindOneOptions<T extends TSchema ? TSchema : T>,
    ): Promise<T | null>;
    findOne(
        filter: FilterQuery<TSchema>,
        options: WithoutProjection<FindOneOptions<TSchema>>,
        callback: MongoCallback<TSchema | null>,
    ): void;
    findOne<T = TSchema>(
        filter: FilterQuery<TSchema>,
        options: FindOneOptions<T extends TSchema ? TSchema : T>,
        callback: MongoCallback<T extends TSchema ? TSchema : T | null>,
    ): void;
    
    findOneAndDelete(
        filter: FilterQuery<TSchema>,
        callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    findOneAndDelete(
        filter: FilterQuery<TSchema>,
        options?: FindOneAndDeleteOption<TSchema>,
    ): Promise<FindAndModifyWriteOpResultObject<TSchema>>;
    findOneAndDelete(
        filter: FilterQuery<TSchema>,
        options: FindOneAndDeleteOption<TSchema>,
        callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    
    findOneAndReplace(
        filter: FilterQuery<TSchema>,
        replacement: object,
        callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    findOneAndReplace(
        filter: FilterQuery<TSchema>,
        replacement: object,
        options?: FindOneAndReplaceOption<TSchema>,
    ): Promise<FindAndModifyWriteOpResultObject<TSchema>>;
    findOneAndReplace(
        filter: FilterQuery<TSchema>,
        replacement: object,
        options: FindOneAndReplaceOption<TSchema>,
        callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    
    findOneAndUpdate(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | TSchema,
        callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    findOneAndUpdate(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | TSchema,
        options?: FindOneAndUpdateOption<TSchema>,
    ): Promise<FindAndModifyWriteOpResultObject<TSchema>>;
    findOneAndUpdate(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | TSchema,
        options: FindOneAndUpdateOption<TSchema>,
        callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    
    geoHaystackSearch(x: number, y: number, callback: MongoCallback<any>): void;
    geoHaystackSearch(x: number, y: number, options?: GeoHaystackSearchOptions): Promise<any>;
    geoHaystackSearch(x: number, y: number, options: GeoHaystackSearchOptions, callback: MongoCallback<any>): void;
    
    
    group(
        keys: object | any[] | Function | Code,
        condition: object,
        initial: object,
        reduce: Function | Code,
        finalize: Function | Code,
        command: boolean,
        callback: MongoCallback<any>,
    ): void;
    
    group(
        keys: object | any[] | Function | Code,
        condition: object,
        initial: object,
        reduce: Function | Code,
        finalize: Function | Code,
        command: boolean,
        options?: { readPreference?: ReadPreferenceOrMode; session?: ClientSession },
    ): Promise<any>;
    
    group(
        keys: object | any[] | Function | Code,
        condition: object,
        initial: object,
        reduce: Function | Code,
        finalize: Function | Code,
        command: boolean,
        options: {
            readPreference?: ReadPreferenceOrMode;
            session?: ClientSession;
        },
        callback: MongoCallback<any>,
    ): void;
    
    indexes(options?: { session: ClientSession }): Promise<any>;
    indexes(callback: MongoCallback<any>): void;
    indexes(options: { session?: ClientSession }, callback: MongoCallback<any>): void;
    
    indexExists(indexes: string | string[], callback: MongoCallback<boolean>): void;
    indexExists(indexes: string | string[], options?: { session: ClientSession }): Promise<boolean>;
    indexExists(
        indexes: string | string[],
        options: { session: ClientSession },
        callback: MongoCallback<boolean>,
    ): void;
    
    indexInformation(callback: MongoCallback<any>): void;
    indexInformation(options?: { full: boolean; session: ClientSession }): Promise<any>;
    indexInformation(options: { full: boolean; session: ClientSession }, callback: MongoCallback<any>): void;
    
    initializeOrderedBulkOp(options?: CommonOptions): OrderedBulkOperation;
    
    initializeUnorderedBulkOp(options?: CommonOptions): UnorderedBulkOperation;
    
    
    insert(docs: OptionalId<TSchema>, callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>): void;
    
    insert(
        docs: OptionalId<TSchema>,
        options?: CollectionInsertOneOptions,
    ): Promise<InsertWriteOpResult<WithId<TSchema>>>;
    
    insert(
        docs: OptionalId<TSchema>,
        options: CollectionInsertOneOptions,
        callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>,
    ): void;
    
    insertMany(docs: Array<OptionalId<TSchema>>, callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>): void;
    insertMany(
        docs: Array<OptionalId<TSchema>>,
        options?: CollectionInsertManyOptions,
    ): Promise<InsertWriteOpResult<WithId<TSchema>>>;
    insertMany(
        docs: Array<OptionalId<TSchema>>,
        options: CollectionInsertManyOptions,
        callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>,
    ): void;
    
    insertOne(docs: OptionalId<TSchema>, callback: MongoCallback<InsertOneWriteOpResult<WithId<TSchema>>>): void;
    insertOne(
        docs: OptionalId<TSchema>,
        options?: CollectionInsertOneOptions,
    ): Promise<InsertOneWriteOpResult<WithId<TSchema>>>;
    insertOne(
        docs: OptionalId<TSchema>,
        options: CollectionInsertOneOptions,
        callback: MongoCallback<InsertOneWriteOpResult<WithId<TSchema>>>,
    ): void;
    
    isCapped(options?: { session: ClientSession }): Promise<any>;
    isCapped(callback: MongoCallback<any>): void;
    isCapped(options: { session: ClientSession }, callback: MongoCallback<any>): void;
    
    listIndexes(options?: {
        batchSize?: number;
        readPreference?: ReadPreferenceOrMode;
        session?: ClientSession;
    }): CommandCursor;
    
    mapReduce<TKey, TValue>(
        map: CollectionMapFunction<TSchema> | string,
        reduce: CollectionReduceFunction<TKey, TValue> | string,
        callback: MongoCallback<any>,
    ): void;
    mapReduce<TKey, TValue>(
        map: CollectionMapFunction<TSchema> | string,
        reduce: CollectionReduceFunction<TKey, TValue> | string,
        options?: MapReduceOptions,
    ): Promise<any>;
    mapReduce<TKey, TValue>(
        map: CollectionMapFunction<TSchema> | string,
        reduce: CollectionReduceFunction<TKey, TValue> | string,
        options: MapReduceOptions,
        callback: MongoCallback<any>,
    ): void;
    
    options(options?: { session: ClientSession }): Promise<any>;
    options(callback: MongoCallback<any>): void;
    options(options: { session: ClientSession }, callback: MongoCallback<any>): void;
    
    parallelCollectionScan(callback: MongoCallback<Array<Cursor<any>>>): void;
    parallelCollectionScan(options?: ParallelCollectionScanOptions): Promise<Array<Cursor<any>>>;
    parallelCollectionScan(options: ParallelCollectionScanOptions, callback: MongoCallback<Array<Cursor<any>>>): void;
    
    reIndex(options?: { session: ClientSession }): Promise<any>;
    reIndex(callback: MongoCallback<any>): void;
    reIndex(options: { session: ClientSession }, callback: MongoCallback<any>): void;
    
    
    remove(selector: object, callback: MongoCallback<WriteOpResult>): void;
    
    remove(selector: object, options?: CommonOptions & { single?: boolean }): Promise<WriteOpResult>;
    
    remove(
        selector: object,
        options?: CommonOptions & { single?: boolean },
        callback?: MongoCallback<WriteOpResult>,
    ): void;
    
    rename(newName: string, callback: MongoCallback<Collection<TSchema>>): void;
    rename(newName: string, options?: { dropTarget?: boolean; session?: ClientSession }): Promise<Collection<TSchema>>;
    rename(
        newName: string,
        options: { dropTarget?: boolean; session?: ClientSession },
        callback: MongoCallback<Collection<TSchema>>,
    ): void;
    
    replaceOne(filter: FilterQuery<TSchema>, doc: TSchema, callback: MongoCallback<ReplaceWriteOpResult>): void;
    replaceOne(filter: FilterQuery<TSchema>, doc: TSchema, options?: ReplaceOneOptions): Promise<ReplaceWriteOpResult>;
    replaceOne(
        filter: FilterQuery<TSchema>,
        doc: TSchema,
        options: ReplaceOneOptions,
        callback: MongoCallback<ReplaceWriteOpResult>,
    ): void;
    
    
    save(doc: TSchema, callback: MongoCallback<WriteOpResult>): void;
    
    save(doc: TSchema, options?: CommonOptions): Promise<WriteOpResult>;
    
    save(doc: TSchema, options: CommonOptions, callback: MongoCallback<WriteOpResult>): void;
    
    stats(callback: MongoCallback<CollStats>): void;
    stats(options?: { scale: number; session?: ClientSession }): Promise<CollStats>;
    stats(options: { scale: number; session?: ClientSession }, callback: MongoCallback<CollStats>): void;
    
    
    update(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        callback: MongoCallback<WriteOpResult>,
    ): void;
    
    update(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options?: UpdateOneOptions & { multi?: boolean },
    ): Promise<WriteOpResult>;
    
    update(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options: UpdateOneOptions & { multi?: boolean },
        callback: MongoCallback<WriteOpResult>,
    ): void;
    
    updateMany(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        callback: MongoCallback<UpdateWriteOpResult>,
    ): void;
    updateMany(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options?: UpdateManyOptions,
    ): Promise<UpdateWriteOpResult>;
    updateMany(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options: UpdateManyOptions,
        callback: MongoCallback<UpdateWriteOpResult>,
    ): void;
    
    updateOne(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        callback: MongoCallback<UpdateWriteOpResult>,
    ): void;
    updateOne(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options?: UpdateOneOptions,
    ): Promise<UpdateWriteOpResult>;
    updateOne(
        filter: FilterQuery<TSchema>,
        update: UpdateQuery<TSchema> | Partial<TSchema>,
        options: UpdateOneOptions,
        callback: MongoCallback<UpdateWriteOpResult>,
    ): void;
    
    watch<T = TSchema>(
        pipeline?: object[],
        options?: ChangeStreamOptions & { session?: ClientSession },
    ): ChangeStream<T>;
    
    watch<T = TSchema>(options?: ChangeStreamOptions & { session?: ClientSession }): ChangeStream<T>;
}


type KeysOfAType<TSchema, Type> = {
    [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? key : never;
}[keyof TSchema];
type KeysOfOtherType<TSchema, Type> = {
    [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? never : key;
}[keyof TSchema];

type AcceptedFields<TSchema, FieldType, AssignableType> = {
    readonly [key in KeysOfAType<TSchema, FieldType>]?: AssignableType;
};


type NotAcceptedFields<TSchema, FieldType> = {
    readonly [key in KeysOfOtherType<TSchema, FieldType>]?: never;
};

type DotAndArrayNotation<AssignableType> = {
    readonly [key: string]: AssignableType;
};

type ReadonlyPartial<TSchema> = {
    readonly [key in keyof TSchema]?: TSchema[key];
};

export type OnlyFieldsOfType<TSchema, FieldType = any, AssignableType = FieldType> = AcceptedFields<
    TSchema,
    FieldType,
    AssignableType
> &
    NotAcceptedFields<TSchema, FieldType> &
    DotAndArrayNotation<AssignableType>;

export type MatchKeysAndValues<TSchema> = ReadonlyPartial<TSchema> & DotAndArrayNotation<any>;

type Unpacked<Type> = Type extends ReadonlyArray<infer Element> ? Element : Type;

type UpdateOptionalId<T> = T extends { _id?: any } ? OptionalId<T> : T;

export type SortValues = -1 | 1;


export type MetaSortOperators = 'textScore' | 'indexKey';

export type MetaProjectionOperators =
    | MetaSortOperators
    
    | 'searchScore'
    
    | 'searchHighlights';

export type SchemaMember<T, V> = { [P in keyof T]?: V } | { [key: string]: V };

export type SortOptionObject<T> = SchemaMember<T, number | { $meta?: MetaSortOperators }>;

export type AddToSetOperators<Type> = {
    $each: Type;
};

export type ArrayOperator<Type> = {
    $each: Type;
    $slice?: number;
    $position?: number;
    $sort?: SortValues | Record<string, SortValues>;
};

export type SetFields<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any> | undefined>]?:
        | UpdateOptionalId<Unpacked<TSchema[key]>>
        | AddToSetOperators<Array<UpdateOptionalId<Unpacked<TSchema[key]>>>>;
} &
    NotAcceptedFields<TSchema, ReadonlyArray<any> | undefined>) & {
    readonly [key: string]: AddToSetOperators<any> | any;
};

export type PushOperator<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?:
        | UpdateOptionalId<Unpacked<TSchema[key]>>
        | ArrayOperator<Array<UpdateOptionalId<Unpacked<TSchema[key]>>>>;
} &
    NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
    readonly [key: string]: ArrayOperator<any> | any;
};

export type PullOperator<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?:
        | Partial<Unpacked<TSchema[key]>>
        | ObjectQuerySelector<Unpacked<TSchema[key]>>;
} &
    NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
    readonly [key: string]: QuerySelector<any> | any;
};

export type PullAllOperator<TSchema> = ({
    readonly [key in KeysOfAType<TSchema, ReadonlyArray<any>>]?: TSchema[key];
} &
    NotAcceptedFields<TSchema, ReadonlyArray<any>>) & {
    readonly [key: string]: any[];
};


export type UpdateQuery<TSchema> = {
    
    $currentDate?: OnlyFieldsOfType<TSchema, Date | Timestamp, true | { $type: 'date' | 'timestamp' }>;
    $inc?: OnlyFieldsOfType<TSchema, NumericTypes | undefined>;
    $min?: MatchKeysAndValues<TSchema>;
    $max?: MatchKeysAndValues<TSchema>;
    $mul?: OnlyFieldsOfType<TSchema, NumericTypes | undefined>;
    $rename?: { [key: string]: string };
    $set?: MatchKeysAndValues<TSchema>;
    $setOnInsert?: MatchKeysAndValues<TSchema>;
    $unset?: OnlyFieldsOfType<TSchema, any, '' | 1 | true>;

    
    $addToSet?: SetFields<TSchema>;
    $pop?: OnlyFieldsOfType<TSchema, ReadonlyArray<any>, 1 | -1>;
    $pull?: PullOperator<TSchema>;
    $push?: PushOperator<TSchema>;
    $pullAll?: PullAllOperator<TSchema>;

    
    $bit?: {
        [key: string]: { [key in 'and' | 'or' | 'xor']?: number };
    };
};


export enum BSONType {
    Double = 1,
    String,
    Object,
    Array,
    BinData,
    
    Undefined,
    ObjectId,
    Boolean,
    Date,
    Null,
    Regex,
    
    DBPointer,
    JavaScript,
    
    Symbol,
    JavaScriptWithScope,
    Int,
    Timestamp,
    Long,
    Decimal,
    MinKey = -1,
    MaxKey = 127,
}

type BSONTypeAlias =
    | 'number'
    | 'double'
    | 'string'
    | 'object'
    | 'array'
    | 'binData'
    | 'undefined'
    | 'objectId'
    | 'bool'
    | 'date'
    | 'null'
    | 'regex'
    | 'dbPointer'
    | 'javascript'
    | 'symbol'
    | 'javascriptWithScope'
    | 'int'
    | 'timestamp'
    | 'long'
    | 'decimal'
    | 'minKey'
    | 'maxKey';


type BitwiseQuery =
    | number 
    | Binary 
    | number[]; 

// we can search using alternative types in mongodb e.g.
// string types can be searched using a regex in mongo
// array types can be searched using their element type
type RegExpForString<T> = T extends string ? RegExp | T : T;
type MongoAltQuery<T> = T extends ReadonlyArray<infer U> ? T | RegExpForString<U> : RegExpForString<T>;


export type QuerySelector<T> = {
    // Comparison
    $eq?: T;
    $gt?: T;
    $gte?: T;
    $in?: T[];
    $lt?: T;
    $lte?: T;
    $ne?: T;
    $nin?: T[];
    // Logical
    $not?: T extends string ? QuerySelector<T> | RegExp : QuerySelector<T>;
    // Element
    
    $exists?: boolean;
    $type?: BSONType | BSONTypeAlias;
    // Evaluation
    $expr?: any;
    $jsonSchema?: any;
    $mod?: T extends number ? [number, number] : never;
    $regex?: T extends string ? RegExp | string : never;
    $options?: T extends string ? string : never;
    // Geospatial
    // TODO: define better types for geo queries
    $geoIntersects?: { $geometry: object };
    $geoWithin?: object;
    $near?: object;
    $nearSphere?: object;
    $maxDistance?: number;
    // Array
    // TODO: define better types for $all and $elemMatch
    $all?: T extends ReadonlyArray<infer U> ? any[] : never;
    $elemMatch?: T extends ReadonlyArray<infer U> ? object : never;
    $size?: T extends ReadonlyArray<infer U> ? number : never;
    // Bitwise
    $bitsAllClear?: BitwiseQuery;
    $bitsAllSet?: BitwiseQuery;
    $bitsAnyClear?: BitwiseQuery;
    $bitsAnySet?: BitwiseQuery;
};

export type RootQuerySelector<T> = {
    
    $and?: Array<FilterQuery<T>>;
    
    $nor?: Array<FilterQuery<T>>;
    
    $or?: Array<FilterQuery<T>>;
    
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacriticSensitive?: boolean;
    };
    
    $where?: string | Function;
    
    $comment?: string;
    // we could not find a proper TypeScript generic to support nested queries e.g. 'user.friends.name'
    // this will mark all unrecognized properties as any (including nested queries)
    [key: string]: any;
};

export type ObjectQuerySelector<T> = T extends object ? { [key in keyof T]?: QuerySelector<T[key]> } : QuerySelector<T>;

export type Condition<T> = MongoAltQuery<T> | QuerySelector<MongoAltQuery<T>>;

export type FilterQuery<T> = {
    [P in keyof T]?: Condition<T[P]>;
} &
    RootQuerySelector<T>;


export type BulkWriteInsertOneOperation<TSchema> = {
    insertOne: {
        document: OptionalId<TSchema>;
    };
};


export type BulkWriteUpdateOperation<TSchema> = {
    arrayFilters?: object[];
    collation?: object;
    hint?: string | object;
    filter: FilterQuery<TSchema>;
    update: UpdateQuery<TSchema>;
    upsert?: boolean;
};
export type BulkWriteUpdateOneOperation<TSchema> = {
    updateOne: BulkWriteUpdateOperation<TSchema>;
};
export type BulkWriteUpdateManyOperation<TSchema> = {
    updateMany: BulkWriteUpdateOperation<TSchema>;
};


export type BulkWriteReplaceOneOperation<TSchema> = {
    replaceOne: {
        collation?: object;
        hint?: string | object;
        filter: FilterQuery<TSchema>;
        replacement: TSchema;
        upsert?: boolean;
    };
};


export type BulkWriteDeleteOperation<TSchema> = {
    collation?: object;
    filter: FilterQuery<TSchema>;
};
export type BulkWriteDeleteOneOperation<TSchema> = {
    deleteOne: BulkWriteDeleteOperation<TSchema>;
};
export type BulkWriteDeleteManyOperation<TSchema> = {
    deleteMany: BulkWriteDeleteOperation<TSchema>;
};


export type BulkWriteOperation<TSchema> =
    | BulkWriteInsertOneOperation<TSchema>
    | BulkWriteUpdateOneOperation<TSchema>
    | BulkWriteUpdateManyOperation<TSchema>
    | BulkWriteReplaceOneOperation<TSchema>
    | BulkWriteDeleteOneOperation<TSchema>
    | BulkWriteDeleteManyOperation<TSchema>;


export interface CollStats {
    
    ns: string;
    
    count: number;
    
    size: number;
    
    avgObjSize: number;
    
    storageSize: number;
    
    numExtents: number;
    
    nindexes: number;
    
    lastExtentSize: number;
    
    paddingFactor: number;
    
    userFlags?: number;
    
    totalIndexSize: number;
    
    indexSizes: {
        _id_: number;
        [index: string]: number;
    };
    
    capped: boolean;
    
    max: number;
    
    maxSize: number;
    wiredTiger?: WiredTigerData;
    indexDetails?: any;
    ok: number;
}

export interface WiredTigerData {
    LSM: {
        'bloom filter false positives': number;
        'bloom filter hits': number;
        'bloom filter misses': number;
        'bloom filter pages evicted from cache': number;
        'bloom filter pages read into cache': number;
        'bloom filters in the LSM tree': number;
        'chunks in the LSM tree': number;
        'highest merge generation in the LSM tree': number;
        'queries that could have benefited from a Bloom filter that did not exist': number;
        'sleep for LSM checkpoint throttle': number;
        'sleep for LSM merge throttle': number;
        'total size of bloom filters': number;
    };
    'block-manager': {
        'allocations requiring file extension': number;
        'blocks allocated': number;
        'blocks freed': number;
        'checkpoint size': number;
        'file allocation unit size': number;
        'file bytes available for reuse': number;
        'file magic number': number;
        'file major version number': number;
        'file size in bytes': number;
        'minor version number': number;
    };
    btree: {
        'btree checkpoint generation': number;
        'column-store fixed-size leaf pages': number;
        'column-store internal pages': number;
        'column-store variable-size RLE encoded values': number;
        'column-store variable-size deleted values': number;
        'column-store variable-size leaf pages': number;
        'fixed-record size': number;
        'maximum internal page key size': number;
        'maximum internal page size': number;
        'maximum leaf page key size': number;
        'maximum leaf page size': number;
        'maximum leaf page value size': number;
        'maximum tree depth': number;
        'number of key/value pairs': number;
        'overflow pages': number;
        'pages rewritten by compaction': number;
        'row-store internal pages': number;
        'row-store leaf pages': number;
    };
    cache: {
        'bytes currently in the cache': number;
        'bytes read into cache': number;
        'bytes written from cache': number;
        'checkpoint blocked page eviction': number;
        'data source pages selected for eviction unable to be evicted': number;
        'hazard pointer blocked page eviction': number;
        'in-memory page passed criteria to be split': number;
        'in-memory page splits': number;
        'internal pages evicted': number;
        'internal pages split during eviction': number;
        'leaf pages split during eviction': number;
        'modified pages evicted': number;
        'overflow pages read into cache': number;
        'overflow values cached in memory': number;
        'page split during eviction deepened the tree': number;
        'page written requiring lookaside records': number;
        'pages read into cache': number;
        'pages read into cache requiring lookaside entries': number;
        'pages requested from the cache': number;
        'pages written from cache': number;
        'pages written requiring in-memory restoration': number;
        'tracked dirty bytes in the cache': number;
        'unmodified pages evicted': number;
    };
    cache_walk: {
        'Average difference between current eviction generation when the page was last considered': number;
        'Average on-disk page image size seen': number;
        'Clean pages currently in cache': number;
        'Current eviction generation': number;
        'Dirty pages currently in cache': number;
        'Entries in the root page': number;
        'Internal pages currently in cache': number;
        'Leaf pages currently in cache': number;
        'Maximum difference between current eviction generation when the page was last considered': number;
        'Maximum page size seen': number;
        'Minimum on-disk page image size seen': number;
        'On-disk page image sizes smaller than a single allocation unit': number;
        'Pages created in memory and never written': number;
        'Pages currently queued for eviction': number;
        'Pages that could not be queued for eviction': number;
        'Refs skipped during cache traversal': number;
        'Size of the root page': number;
        'Total number of pages currently in cache': number;
    };
    compression: {
        'compressed pages read': number;
        'compressed pages written': number;
        'page written failed to compress': number;
        'page written was too small to compress': number;
        'raw compression call failed, additional data available': number;
        'raw compression call failed, no additional data available': number;
        'raw compression call succeeded': number;
    };
    cursor: {
        'bulk-loaded cursor-insert calls': number;
        'create calls': number;
        'cursor-insert key and value bytes inserted': number;
        'cursor-remove key bytes removed': number;
        'cursor-update value bytes updated': number;
        'insert calls': number;
        'next calls': number;
        'prev calls': number;
        'remove calls': number;
        'reset calls': number;
        'restarted searches': number;
        'search calls': number;
        'search near calls': number;
        'truncate calls': number;
        'update calls': number;
    };
    reconciliation: {
        'dictionary matches': number;
        'fast-path pages deleted': number;
        'internal page key bytes discarded using suffix compression': number;
        'internal page multi-block writes': number;
        'internal-page overflow keys': number;
        'leaf page key bytes discarded using prefix compression': number;
        'leaf page multi-block writes': number;
        'leaf-page overflow keys': number;
        'maximum blocks required for a page': number;
        'overflow values written': number;
        'page checksum matches': number;
        'page reconciliation calls': number;
        'page reconciliation calls for eviction': number;
        'pages deleted': number;
    };
}


export interface CollectionAggregationOptions {
    readPreference?: ReadPreferenceOrMode;
    
    cursor?: { batchSize?: number };
    
    explain?: boolean;
    
    allowDiskUse?: boolean;
    
    maxTimeMS?: number;
    
    bypassDocumentValidation?: boolean;
    hint?: string | object;
    raw?: boolean;
    promoteLongs?: boolean;
    promoteValues?: boolean;
    promoteBuffers?: boolean;
    collation?: CollationDocument;
    comment?: string;
    session?: ClientSession;
}


export interface CollectionInsertManyOptions extends CommonOptions {
    
    serializeFunctions?: boolean;
    
    forceServerObjectId?: boolean;
    
    bypassDocumentValidation?: boolean;
    
    ordered?: boolean;
}


export interface CollectionBulkWriteOptions extends CommonOptions {
    
    serializeFunctions?: boolean;
    
    ordered?: boolean;
    
    bypassDocumentValidation?: boolean;
    //Force server to assign _id values instead of driver.
    forceServerObjectId?: boolean;
}


export interface BulkWriteOpResultObject {
    insertedCount?: number;
    matchedCount?: number;
    modifiedCount?: number;
    deletedCount?: number;
    upsertedCount?: number;
    insertedIds?: { [index: number]: any };
    upsertedIds?: { [index: number]: any };
    result?: any;
}


export interface MongoCountPreferences {
    
    limit?: number;
    
    skip?: number;
    
    hint?: string;
    
    readPreference?: ReadPreferenceOrMode;
    
    maxTimeMS?: number;
    
    session?: ClientSession;
}


export interface MongoDistinctPreferences {
    
    readPreference?: ReadPreferenceOrMode;
    
    maxTimeMS?: number;
    
    session?: ClientSession;
}


export interface DeleteWriteOpResultObject {
    //The raw result returned from MongoDB, field will vary depending on server version.
    result: {
        //Is 1 if the command executed correctly.
        ok?: number;
        //The total count of documents deleted.
        n?: number;
    };
    //The connection object used for the operation.
    connection?: any;
    //The number of documents deleted.
    deletedCount?: number;
}


export interface FindAndModifyWriteOpResultObject<TSchema> {
    //Document returned from findAndModify command.
    value?: TSchema;
    //The raw lastErrorObject returned from the command.
    lastErrorObject?: any;
    //Is 1 if the command executed correctly.
    ok?: number;
}


export interface FindOneAndReplaceOption<T> extends CommonOptions {
    projection?: SchemaMember<T, ProjectionOperators | number | boolean | any>;
    sort?: SortOptionObject<T>;
    maxTimeMS?: number;
    upsert?: boolean;
    returnOriginal?: boolean;
    collation?: CollationDocument;
}


export interface ProjectionOperators {
    
    $elemMatch?: object;
    
    $slice?: number | [number, number];
    $meta?: MetaProjectionOperators;
}


export interface FindOneAndUpdateOption<T> extends FindOneAndReplaceOption<T> {
    arrayFilters?: object[];
}


export interface FindOneAndDeleteOption<T> {
    projection?: SchemaMember<T, ProjectionOperators | number | boolean | any>;
    sort?: SortOptionObject<T>;
    maxTimeMS?: number;
    session?: ClientSession;
    collation?: CollationDocument;
}


export interface GeoHaystackSearchOptions {
    readPreference?: ReadPreferenceOrMode;
    maxDistance?: number;
    search?: object;
    limit?: number;
    session?: ClientSession;
}


export class Code {
    constructor(code: string | Function, scope?: object);
    code: string | Function;
    scope: any;
}


export interface OrderedBulkOperation {
    length: number;
    
    execute(callback: MongoCallback<BulkWriteResult>): void;
    execute(options?: FSyncOptions): Promise<BulkWriteResult>;
    execute(options: FSyncOptions, callback: MongoCallback<BulkWriteResult>): void;
    
    find(selector: object): FindOperatorsOrdered;
    
    insert(doc: object): OrderedBulkOperation;
}


export interface BulkWriteResultUpsertedIdObject {
    index: number;
    _id: ObjectId;
}


export interface BulkWriteResult {
    
    ok: boolean;

    
    nInserted: number;

    
    nMatched: number;

    
    nModified: number;

    
    nUpserted: number;

    
    nRemoved: number;

    // Returns an array of all inserted ids
    getInsertedIds(): object[];
    // Retrieve lastOp if available
    getLastOp(): object;
    // Returns raw internal result
    getRawResponse(): object;

    
    getUpsertedIdAt(index: number): BulkWriteResultUpsertedIdObject;

    // Returns an array of all upserted ids
    getUpsertedIds(): BulkWriteResultUpsertedIdObject[];
    // Retrieve the write concern error if any
    getWriteConcernError(): WriteConcernError;

    
    getWriteErrorAt(index: number): WriteError;

    // Returns the number of write errors off the bulk operation
    getWriteErrorCount(): number;
    // Retrieve all write errors
    getWriteErrors(): object[];
    hasWriteErrors(): boolean;
}


export interface WriteError {
    //Write concern error code.
    code: number;
    //Write concern error original bulk operation index.
    index: number;
    //Write concern error message.
    errmsg: string;
}


export interface WriteConcernError {
    //Write concern error code.
    code: number;
    //Write concern error message.
    errmsg: string;
}


export interface FindOperatorsOrdered {
    delete(): OrderedBulkOperation;
    deleteOne(): OrderedBulkOperation;
    replaceOne(doc: object): OrderedBulkOperation;
    update(doc: object): OrderedBulkOperation;
    updateOne(doc: object): OrderedBulkOperation;
    upsert(): FindOperatorsOrdered;
}


export interface UnorderedBulkOperation {
    
    length: number;
    
    execute(callback: MongoCallback<BulkWriteResult>): void;
    execute(options?: FSyncOptions): Promise<BulkWriteResult>;
    execute(options: FSyncOptions, callback: MongoCallback<BulkWriteResult>): void;
    
    find(selector: object): FindOperatorsUnordered;
    
    insert(doc: object): UnorderedBulkOperation;
}


export interface FindOperatorsUnordered {
    length: number;
    remove(): UnorderedBulkOperation;
    removeOne(): UnorderedBulkOperation;
    replaceOne(doc: object): UnorderedBulkOperation;
    update(doc: object): UnorderedBulkOperation;
    updateOne(doc: object): UnorderedBulkOperation;
    upsert(): FindOperatorsUnordered;
}


export interface FindOneOptions<T> {
    limit?: number;
    sort?: Array<[string, number]> | SortOptionObject<T>;
    projection?: SchemaMember<T, ProjectionOperators | number | boolean | any>;
    
    fields?: { [P in keyof T]: boolean | number };
    skip?: number;
    hint?: object;
    explain?: boolean;
    snapshot?: boolean;
    timeout?: boolean;
    tailable?: boolean;
    awaitData?: boolean;
    batchSize?: number;
    returnKey?: boolean;
    maxScan?: number;
    min?: number;
    max?: number;
    showDiskLoc?: boolean;
    comment?: string;
    raw?: boolean;
    promoteLongs?: boolean;
    promoteValues?: boolean;
    promoteBuffers?: boolean;
    readPreference?: ReadPreferenceOrMode;
    partial?: boolean;
    maxTimeMS?: number;
    collation?: CollationDocument;
    session?: ClientSession;
}


export interface CollectionInsertOneOptions extends CommonOptions {
    
    serializeFunctions?: boolean;
    //Force server to assign _id values instead of driver.
    forceServerObjectId?: boolean;
    //Allow driver to bypass schema validation in MongoDB 3.2 or higher.
    bypassDocumentValidation?: boolean;
}


export interface InsertWriteOpResult<TSchema extends { _id: any }> {
    insertedCount: number;
    ops: TSchema[];
    insertedIds: { [key: number]: TSchema['_id'] };
    connection: any;
    result: { ok: number; n: number };
}


export interface InsertOneWriteOpResult<TSchema extends { _id: any }> {
    insertedCount: number;
    ops: TSchema[];
    insertedId: TSchema['_id'];
    connection: any;
    result: { ok: number; n: number };
}


export interface ParallelCollectionScanOptions {
    readPreference?: ReadPreferenceOrMode;
    batchSize?: number;
    numCursors?: number;
    raw?: boolean;
    session?: ClientSession;
}


export interface ReplaceOneOptions extends CommonOptions {
    upsert?: boolean;
    bypassDocumentValidation?: boolean;
}


export interface UpdateOneOptions extends ReplaceOneOptions {
    arrayFilters?: object[];
}


export interface UpdateManyOptions extends CommonOptions {
    upsert?: boolean;
    arrayFilters?: object[];
}


export interface UpdateWriteOpResult {
    result: { ok: number; n: number; nModified: number };
    connection: any;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: { _id: ObjectId };
}


export interface ReplaceWriteOpResult extends UpdateWriteOpResult {
    ops: any[];
}


export interface MapReduceOptions {
    readPreference?: ReadPreferenceOrMode;
    out?: object;
    query?: object;
    sort?: object;
    limit?: number;
    keeptemp?: boolean;
    finalize?: Function | string;
    scope?: object;
    jsMode?: boolean;
    verbose?: boolean;
    bypassDocumentValidation?: boolean;
    session?: ClientSession;
}

export type CollectionMapFunction<TSchema> = (this: TSchema) => void;

export type CollectionReduceFunction<TKey, TValue> = (key: TKey, values: TValue[]) => TValue;


export interface WriteOpResult {
    ops: any[];
    connection: any;
    result: any;
}


export type CursorResult = object | null | boolean;

type Default = any;
type DefaultSchema = any;


export class Cursor<T = Default> extends Readable {
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
    sortValue: string;
    timeout: boolean;
    readPreference: ReadPreference;
    
    addCursorFlag(flag: string, value: boolean): Cursor<T>;
    
    addQueryModifier(name: string, value: boolean): Cursor<T>;
    
    batchSize(value: number): Cursor<T>;
    bufferedCount(): number;
    
    clone(): Cursor<T>; // still returns the same type
    
    close(): Promise<CursorResult>;
    close(callback: MongoCallback<CursorResult>): void;
    
    collation(value: CollationDocument): Cursor<T>;
    
    comment(value: string): Cursor<T>;
    
    count(callback: MongoCallback<number>): void;
    count(applySkipLimit: boolean, callback: MongoCallback<number>): void;
    count(options: CursorCommentOptions, callback: MongoCallback<number>): void;
    count(applySkipLimit: boolean, options: CursorCommentOptions, callback: MongoCallback<number>): void;
    count(applySkipLimit?: boolean, options?: CursorCommentOptions): Promise<number>;
    
    explain(): Promise<CursorResult>;
    explain(callback: MongoCallback<CursorResult>): void;
    
    filter(filter: object): Cursor<T>;
    
    forEach(iterator: IteratorCallback<T>, callback: EndCallback): void;
    forEach(iterator: IteratorCallback<T>): Promise<void>;
    
    hasNext(): Promise<boolean>;
    hasNext(callback: MongoCallback<boolean>): void;
    
    hint(hint: string | object): Cursor<T>;
    
    isClosed(): boolean;
    
    limit(value: number): Cursor<T>;
    
    map<U>(transform: (document: T) => U): Cursor<U>;
    
    max(max: object): Cursor<T>;
    
    maxAwaitTimeMS(value: number): Cursor<T>;
    
    maxScan(maxScan: object): Cursor<T>;
    
    maxTimeMS(value: number): Cursor<T>;
    
    min(min: object): Cursor<T>;
    
    next(): Promise<T | null>;
    next(callback: MongoCallback<T | null>): void;
    
    project<U = T>(value: SchemaMember<T, ProjectionOperators | number | boolean | any>): Cursor<U>;
    
    read(size: number): string | Buffer | void;
    
    returnKey(returnKey: boolean): Cursor<T>;
    
    rewind(): void;
    
    setCursorOption(field: string, value: object): Cursor<T>;
    
    setReadPreference(readPreference: ReadPreferenceOrMode): Cursor<T>;
    
    showRecordId(showRecordId: boolean): Cursor<T>;
    
    skip(value: number): Cursor<T>;
    
    snapshot(snapshot: object): Cursor<T>;
    
    sort(keyOrList: string | Array<[string, number]> | SortOptionObject<T>, direction?: number): Cursor<T>;
    
    stream(options?: { transform?: (document: T) => any }): Cursor<T>;
    
    toArray(): Promise<T[]>;
    toArray(callback: MongoCallback<T[]>): void;
    
    unshift(stream: Buffer | string): void;
}


export interface CursorCommentOptions {
    skip?: number;
    limit?: number;
    maxTimeMS?: number;
    hint?: string;
    readPreference?: ReadPreferenceOrMode;
}


export interface IteratorCallback<T> {
    (doc: T): void;
}


export interface EndCallback {
    (error: MongoError): void;
}


export type AggregationCursorResult = object | null;

export class AggregationCursor<T = Default> extends Cursor<T> {
    
    batchSize(value: number): AggregationCursor<T>;
    
    clone(): AggregationCursor<T>;
    
    close(): Promise<AggregationCursorResult>;
    close(callback: MongoCallback<AggregationCursorResult>): void;
    
    each(callback: MongoCallback<AggregationCursorResult>): void;
    
    explain(): Promise<AggregationCursorResult>;
    explain(callback: MongoCallback<AggregationCursorResult>): void;
    
    geoNear(document: object): AggregationCursor<T>;
    
    group<U = T>(document: object): AggregationCursor<U>;
    
    hasNext(): Promise<boolean>;
    hasNext(callback: MongoCallback<boolean>): void;
    
    isClosed(): boolean;
    
    limit(value: number): AggregationCursor<T>;
    
    lookup(document: object): AggregationCursor<T>;
    
    match(document: object): AggregationCursor<T>;
    
    maxTimeMS(value: number): AggregationCursor<T>;
    
    next(): Promise<T | null>;
    next(callback: MongoCallback<T | null>): void;
    
    out(destination: string): AggregationCursor<T>;
    
    project<U = T>(document: object): AggregationCursor<U>;
    
    read(size: number): string | Buffer | void;
    
    redact(document: object): AggregationCursor<T>;
    
    rewind(): AggregationCursor<T>;
    
    skip(value: number): AggregationCursor<T>;
    
    sort(document: object): AggregationCursor<T>;
    
    toArray(): Promise<T[]>;
    toArray(callback: MongoCallback<T[]>): void;
    
    unshift(stream: Buffer | string): void;
    
    unwind<U = T>(
        field: string | { path: string; includeArrayIndex?: string; preserveNullAndEmptyArrays?: boolean },
    ): AggregationCursor<U>;
}


export type CommandCursorResult = object | null;

export class CommandCursor extends Readable {
    
    hasNext(): Promise<boolean>;
    
    hasNext(callback: MongoCallback<boolean>): void;
    
    batchSize(value: number): CommandCursor;
    
    clone(): CommandCursor;
    
    close(): Promise<CommandCursorResult>;
    close(callback: MongoCallback<CommandCursorResult>): void;
    
    each(callback: MongoCallback<CommandCursorResult>): void;
    
    isClosed(): boolean;
    
    maxTimeMS(value: number): CommandCursor;
    
    next(): Promise<CommandCursorResult>;
    next(callback: MongoCallback<CommandCursorResult>): void;
    
    read(size: number): string | Buffer | void;
    
    rewind(): CommandCursor;
    
    setReadPreference(readPreference: ReadPreferenceOrMode): CommandCursor;
    
    toArray(): Promise<any[]>;
    toArray(callback: MongoCallback<any[]>): void;
    
    unshift(stream: Buffer | string): void;
}


export class GridFSBucket {
    constructor(db: Db, options?: GridFSBucketOptions);
    
    delete(id: ObjectId, callback?: GridFSBucketErrorCallback): void;
    
    drop(callback?: GridFSBucketErrorCallback): void;
    
    find(filter?: object, options?: GridFSBucketFindOptions): Cursor<any>;
    
    openDownloadStream(id: ObjectId, options?: { start: number; end: number }): GridFSBucketReadStream;
    
    openDownloadStreamByName(
        filename: string,
        options?: { revision: number; start: number; end: number },
    ): GridFSBucketReadStream;
    
    openUploadStream(filename: string, options?: GridFSBucketOpenUploadStreamOptions): GridFSBucketWriteStream;
    
    openUploadStreamWithId(
        id: GridFSBucketWriteStreamId,
        filename: string,
        options?: GridFSBucketOpenUploadStreamOptions,
    ): GridFSBucketWriteStream;
    
    rename(id: ObjectId, filename: string, callback?: GridFSBucketErrorCallback): void;
}


export interface GridFSBucketOptions {
    bucketName?: string;
    chunkSizeBytes?: number;
    writeConcern?: WriteConcern;
    readPreference?: ReadPreferenceOrMode;
}


export interface GridFSBucketErrorCallback extends MongoCallback<void> {}


export interface GridFSBucketFindOptions {
    batchSize?: number;
    limit?: number;
    maxTimeMS?: number;
    noCursorTimeout?: boolean;
    skip?: number;
    sort?: object;
}


export interface GridFSBucketOpenUploadStreamOptions {
    chunkSizeBytes?: number;
    metadata?: object;
    contentType?: string;
    aliases?: string[];
}


export class GridFSBucketReadStream extends Readable {
    id: ObjectId;
    constructor(
        chunks: Collection<any>,
        files: Collection<any>,
        readPreference: object,
        filter: object,
        options?: GridFSBucketReadStreamOptions,
    );
}


export interface GridFSBucketReadStreamOptions {
    sort?: number;
    skip?: number;
    start?: number;
    end?: number;
}


export class GridFSBucketWriteStream extends Writable {
    id: GridFSBucketWriteStreamId;
    constructor(bucket: GridFSBucket, filename: string, options?: GridFSBucketWriteStreamOptions);

    
    abort(callback?: GridFSBucketErrorCallback): void;
}


export interface GridFSBucketWriteStreamOptions extends WriteConcern {
    
    id?: GridFSBucketWriteStreamId;
    
    chunkSizeBytes?: number;
    
    disableMD5?: boolean;
}


type EventArguments<T> = [T] extends [(...args: infer U) => any] ? U : [T] extends [undefined] ? [] : [T];


declare class TypedEventEmitter<Events> {
    addListener<E extends keyof Events>(event: E, listener: Events[E]): this;
    on<E extends keyof Events>(event: E, listener: Events[E]): this;
    once<E extends keyof Events>(event: E, listener: Events[E]): this;
    prependListener<E extends keyof Events>(event: E, listener: Events[E]): this;
    prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]): this;

    off<E extends keyof Events>(event: E, listener: Events[E]): this;
    removeAllListeners<E extends keyof Events>(event?: E): this;
    removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

    emit<E extends keyof Events>(event: E, ...args: EventArguments<Events[E]>): boolean;
    eventNames(): Array<keyof Events>;
    rawListeners<E extends keyof Events>(event: E): Function[];
    listeners<E extends keyof Events>(event: E): Function[];
    listenerCount<E extends keyof Events>(event: E): number;

    getMaxListeners(): number;
    setMaxListeners(maxListeners: number): this;
}

interface ChangeStreamEvents<TSchema extends { [key: string]: any } = DefaultSchema> {
    change: (doc: ChangeEvent<TSchema>) => void;
    close: () => void;
    end: () => void;
    error: (err: MongoError) => void;
    resumeTokenChanged: (newToken: ResumeToken) => void;
}


export class ChangeStream<TSchema extends { [key: string]: any } = DefaultSchema> extends TypedEventEmitter<
    ChangeStreamEvents<TSchema>
> {
    resumeToken: ResumeToken;

    constructor(parent: MongoClient | Db | Collection, pipeline: object[], options?: ChangeStreamOptions);

    
    close(): Promise<any>;
    close(callback: MongoCallback<any>): void;

    
    hasNext(): Promise<any>;
    hasNext(callback: MongoCallback<any>): void;

    
    isClosed(): boolean;

    
    next(): Promise<any>;
    next(callback: MongoCallback<any>): void;

    
    stream(options?: { transform?: Function }): Cursor;
}

export class ResumeToken {}

export type ChangeEventTypes =
    | 'insert'
    | 'delete'
    | 'replace'
    | 'update'
    | 'drop'
    | 'rename'
    | 'dropDatabase'
    | 'invalidate';
export interface ChangeEventBase<TSchema extends { [key: string]: any } = DefaultSchema> {
    _id: ResumeToken;
    
    // operationType: ChangeEventTypes;
    ns: {
        db: string;
        coll: string;
    };
    clusterTime: Timestamp;
    txnNumber?: number;
    lsid?: {
        id: any;
        uid: any;
    };
}
export interface ChangeEventCR<TSchema extends { [key: string]: any } = DefaultSchema>
    extends ChangeEventBase<TSchema> {
    operationType: 'insert' | 'replace';
    fullDocument?: TSchema;
    documentKey: {
        _id: ExtractIdType<TSchema>;
    };
}
type FieldUpdates<TSchema> = Partial<TSchema> & { [key: string]: any };
export interface ChangeEventUpdate<TSchema extends { [key: string]: any } = DefaultSchema>
    extends ChangeEventBase<TSchema> {
    operationType: 'update';
    updateDescription: {
        
        updatedFields: FieldUpdates<TSchema>;
        removedFields: Array<keyof TSchema | string>;
    };
    fullDocument?: TSchema;
    documentKey: {
        _id: ExtractIdType<TSchema>;
    };
}
export interface ChangeEventDelete<TSchema extends { [key: string]: any } = DefaultSchema>
    extends ChangeEventBase<TSchema> {
    operationType: 'delete';
    documentKey: {
        _id: ExtractIdType<TSchema>;
    };
}
export interface ChangeEventRename<TSchema extends { [key: string]: any } = DefaultSchema>
    extends ChangeEventBase<TSchema> {
    operationType: 'rename';
    to: {
        db: string;
        coll: string;
    };
}

export interface ChangeEventOther<TSchema extends { [key: string]: any } = DefaultSchema>
    extends ChangeEventBase<TSchema> {
    operationType: 'drop' | 'dropDatabase';
}

export interface ChangeEventInvalidate<TSchema extends { [key: string]: any } = DefaultSchema> {
    _id: ResumeToken;
    operationType: 'invalidate';
    clusterTime: Timestamp;
}

export type ChangeEvent<TSchema extends object = { _id: ObjectId }> =
    | ChangeEventCR<TSchema>
    | ChangeEventUpdate<TSchema>
    | ChangeEventDelete<TSchema>
    | ChangeEventRename<TSchema>
    | ChangeEventOther<TSchema>
    | ChangeEventInvalidate<TSchema>;


export interface ChangeStreamOptions {
    fullDocument?: 'default' | 'updateLookup';
    maxAwaitTimeMS?: number;
    resumeAfter?: ResumeToken;
    startAfter?: ResumeToken;
    startAtOperationTime?: Timestamp;
    batchSize?: number;
    collation?: CollationDocument;
    readPreference?: ReadPreferenceOrMode;
}

type GridFSBucketWriteStreamId = string | number | object | ObjectId;

export interface LoggerOptions {
    
    loggerLevel?: string;
    
    logger?: log;
}

export type log = (message?: string, state?: LoggerState) => void;

export interface LoggerState {
    type: string;
    message: string;
    className: string;
    pid: number;
    date: number;
}


export class Logger {
    constructor(className: string, options?: LoggerOptions);
    
    debug(message: string, state: LoggerState): void;
    
    warn(message: string, state: LoggerState): void;
    
    info(message: string, state: LoggerState): void;
    
    error(message: string, state: LoggerState): void;
    
    isInfo(): boolean;
    
    isError(): boolean;
    
    isWarn(): boolean;
    
    isDebug(): boolean;
    
    static reset(): void;
    
    static currentLogger(): log;
    //Set the current logger function
    static setCurrentLogger(log: log): void;
    
    static filter(type: string, values: string[]): void;
    
    static setLevel(level: string): void;
}


export interface CollationDocument {
    locale: string;
    strength?: number;
    caseLevel?: boolean;
    caseFirst?: string;
    numericOrdering?: boolean;
    alternate?: string;
    maxVariable?: string;
    backwards?: boolean;
    normalization?: boolean;
}


export interface IndexSpecification {
    key: object;
    name?: string;
    background?: boolean;
    unique?: boolean;
    partialFilterExpression?: object;
    sparse?: boolean;
    expireAfterSeconds?: number;
    storageEngine?: object;
    weights?: object;
    default_language?: string;
    language_override?: string;
    textIndexVersion?: number;
    '2dsphereIndexVersion'?: number;
    bits?: number;
    min?: number;
    max?: number;
    bucketSize?: number;
    collation?: CollationDocument;
}

`
