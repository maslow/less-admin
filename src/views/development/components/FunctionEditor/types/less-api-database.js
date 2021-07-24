
// Db types
export const less_api_database_declare = `
// Query types
declare type OrderByDirection = 'desc' | 'asc';
interface GetRes {
  data: any[];
  requestId: string;
  total?: number;
  limit?: number;
  offset?: number;
  ok: boolean;
}
interface GetOneRes {
  data: any;
  requestId: string;
  ok: boolean;
}
interface UpdateRes {
  updated: number;
  matched: number;
  upsertedId: number;
  requestId: string;
  ok: boolean;
}
interface RemoveRes {
  deleted: number;
  requestId: string;
  ok: boolean;
}
interface CountRes {
  total: number;
  requestId: string;
  ok: boolean;
}
interface ErrorRes {
  code: string | number;
  error: string;
}
declare enum JoinType {
  INNER = "inner",
  LEFT = "left",
  RIGHT = "right",
  FULL = "full"
}
interface WithParam {
  query: Query;
  localField: string;
  foreignField: string;
  as?: string;
  one?: boolean;
}
declare class Query {
  where(query: object): Query;
  orderBy(fieldPath: string, directionStr: OrderByDirection): Query;
  join(collection: string, rightKey: string, leftKey: string, type?: JoinType): Query;
  leftJoin(collection: string, rightKey: string, leftKey: string): Query;
  rightJoin(collection: string, rightKey: string, leftKey: string): Query;
  fullJoin(collection: string, rightKey: string, leftKey: string): Query;
  innerJoin(collection: string, rightKey: string, leftKey: string): Query;
  with(param: WithParam): Query;
  withOne(param: WithParam): Query;
  field(projection: string[] | any): Query;
  limit(limit: number): Query;
  skip(offset: number): Query;
  clone(): Query;
  get(options?: {
      nested?: boolean;
  }, callback?: any): Promise<GetRes & ErrorRes>;
  getOne(options?: {
      nested?: boolean;
  }): Promise<GetOneRes & ErrorRes>;
  merge(options?: {
      nested?: boolean;
      intersection?: boolean;
  }): Promise<GetRes & ErrorRes>;
  count(callback?: any): Promise<CountRes & ErrorRes>;
  update(data: Object, options?: {
      multi: boolean;
      merge: boolean;
      upsert: boolean;
  }, callback?: any): Promise<UpdateRes & ErrorRes>;
  remove(options?: {
      multi: boolean;
  }, callback?: any): Promise<RemoveRes & ErrorRes>;
}


// Document types
declare class DocumentReference {
  readonly id: string | number;
  readonly projection: Object;
  get primaryKey(): string;
  set(data: Object, callback?: any): Promise<{
      updated: number;
      matched: number;
      upsertedId: number;
      requestId: string;
  } | {
      code: string;
      error: string;
  }>;
  update(data: Object, callback?: any): Promise<{
      updated: number;
      matched: number;
      upsertedId: number;
      requestId: string;
      ok: boolean;
  } | {
      code: string;
      error: string;
  }>;
  remove(callback?: any): Promise<{
      deleted: number;
      requestId: string;
  }>;
  get(callback?: any): Promise<GetRes>;
  field(projection: Object): DocumentReference;
}

// Others
declare class Point {
  readonly latitude: number;
  readonly longitude: number;
  constructor(longitude: number, latitude: number);
  parse(key: any): {
      [x: number]: {
          type: string;
          coordinates: number[];
      };
  };
  toJSON(): {
      type: string;
      coordinates: number[];
  };
  toReadableString(): string;
  static validate(point: ISerializedPoint): boolean;
  get _internalType(): import("../utils/symbol").InternalSymbol;
}

// Command Types

// Update commands
declare enum UPDATE_COMMANDS_LITERAL {
  SET = "set",
  REMOVE = "remove",
  INC = "inc",
  MUL = "mul",
  PUSH = "push",
  PULL = "pull",
  PULL_ALL = "pullAll",
  POP = "pop",
  SHIFT = "shift",
  UNSHIFT = "unshift",
  ADD_TO_SET = "addToSet",
  BIT = "bit",
  RENAME = "rename",
  MAX = "max",
  MIN = "min"
}
declare class UpdateCommand {
  fieldName: string | InternalSymbol;
  operator: UPDATE_COMMANDS_LITERAL;
  operands: any;
  _internalType: InternalSymbol;
  constructor(operator: UPDATE_COMMANDS_LITERAL, operands?: any, fieldName?: string | InternalSymbol);
  _setFieldName(fieldName: string): UpdateCommand;
}
// Logic commands
declare enum LOGIC_COMMANDS_LITERAL {
  AND = "and",
  OR = "or",
  NOT = "not",
  NOR = "nor"
}
declare class LogicCommand {
  fieldName: string | InternalSymbol;
  operator: LOGIC_COMMANDS_LITERAL | string;
  operands: any[];
  _internalType: InternalSymbol;
  constructor(operator: LOGIC_COMMANDS_LITERAL | string, operands: any, fieldName?: string | InternalSymbol);
  _setFieldName(fieldName: string): LogicCommand;
  and(...__expressions__: LogicCommand[]): LogicCommand;
  or(...__expressions__: LogicCommand[]): LogicCommand;
}

// Query commands
declare enum QUERY_COMMANDS_LITERAL {
  EQ = "eq",
  NEQ = "neq",
  GT = "gt",
  GTE = "gte",
  LT = "lt",
  LTE = "lte",
  IN = "in",
  NIN = "nin",
  ALL = "all",
  ELEM_MATCH = "elemMatch",
  EXISTS = "exists",
  SIZE = "size",
  MOD = "mod",
  GEO_NEAR = "geoNear",
  GEO_WITHIN = "geoWithin",
  GEO_INTERSECTS = "geoIntersects",
  LIKE = "like"
}
declare class QueryCommand extends LogicCommand {
  operator: QUERY_COMMANDS_LITERAL;
  constructor(operator: QUERY_COMMANDS_LITERAL, operands: any, fieldName?: string | InternalSymbol);
  toJSON(): {
      [x: string]: any;
  };
  _setFieldName(fieldName: string): QueryCommand;
  eq(val: any): LogicCommand;
  neq(val: any): LogicCommand;
  gt(val: any): LogicCommand;
  gte(val: any): LogicCommand;
  lt(val: any): LogicCommand;
  lte(val: any): LogicCommand;
  in(list: any[]): LogicCommand;
  nin(list: any[]): LogicCommand;
  geoNear(val: IGeoNearOptions): LogicCommand;
  geoWithin(val: IGeoWithinOptions): LogicCommand;
  geoIntersects(val: IGeoIntersectsOptions): LogicCommand;
}
declare type IQueryCondition = Record<string, any> | LogicCommand;
declare const Command: {
  eq(val: any): QueryCommand;
  neq(val: any): QueryCommand;
  lt(val: any): QueryCommand;
  lte(val: any): QueryCommand;
  gt(val: any): QueryCommand;
  gte(val: any): QueryCommand;
  in(val: any): QueryCommand;
  nin(val: any): QueryCommand;
  all(val: any): QueryCommand;
  elemMatch(val: any): QueryCommand;
  exists(val: boolean): QueryCommand;
  size(val: number): QueryCommand;
  mod(val: number[]): QueryCommand;
  geoNear(val: any): QueryCommand;
  geoWithin(val: any): QueryCommand;
  geoIntersects(val: any): QueryCommand;
  like(val: string): QueryCommand;
  and(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
  nor(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
  or(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
  not(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
  set(val: any): UpdateCommand;
  remove(): UpdateCommand;
  inc(val: number): UpdateCommand;
  mul(val: number): UpdateCommand;
  push(...args: any[]): UpdateCommand;
  pull(values: any): UpdateCommand;
  pullAll(values: any): UpdateCommand;
  pop(): UpdateCommand;
  shift(): UpdateCommand;
  unshift(...__values__: any[]): UpdateCommand;
  addToSet(values: any): UpdateCommand;
  rename(values: any): UpdateCommand;
  bit(values: any): UpdateCommand;
  max(values: any): UpdateCommand;
  min(values: any): UpdateCommand;
  expr(values: AggregationOperator): {
      $expr: AggregationOperator;
  };
  jsonSchema(schema: any): {
      $jsonSchema: any;
  };
  text(values: string | {
      search: string;
      language?: string;
      caseSensitive?: boolean;
      diacriticSensitive: boolean;
  }): {
      $search: {
          (regexp: string | RegExp): number;
          (searcher: {
              [Symbol.search](string: string): number;
          }): number;
      };
      $language?: undefined;
      $caseSensitive?: undefined;
      $diacriticSensitive?: undefined;
  } | {
      $search: string;
      $language: string;
      $caseSensitive: boolean;
      $diacriticSensitive: boolean;
  };
  aggregate: {
      pipeline(): Aggregation;
      abs: (param: any) => AggregationOperator;
      add: (param: any) => AggregationOperator;
      ceil: (param: any) => AggregationOperator;
      divide: (param: any) => AggregationOperator;
      exp: (param: any) => AggregationOperator;
      floor: (param: any) => AggregationOperator;
      ln: (param: any) => AggregationOperator;
      log: (param: any) => AggregationOperator;
      log10: (param: any) => AggregationOperator;
      mod: (param: any) => AggregationOperator;
      multiply: (param: any) => AggregationOperator;
      pow: (param: any) => AggregationOperator;
      sqrt: (param: any) => AggregationOperator;
      subtract: (param: any) => AggregationOperator;
      trunc: (param: any) => AggregationOperator;
      arrayElemAt: (param: any) => AggregationOperator;
      arrayToObject: (param: any) => AggregationOperator;
      concatArrays: (param: any) => AggregationOperator;
      filter: (param: any) => AggregationOperator;
      in: (param: any) => AggregationOperator;
      indexOfArray: (param: any) => AggregationOperator;
      isArray: (param: any) => AggregationOperator;
      map: (param: any) => AggregationOperator;
      range: (param: any) => AggregationOperator;
      reduce: (param: any) => AggregationOperator;
      reverseArray: (param: any) => AggregationOperator;
      size: (param: any) => AggregationOperator;
      slice: (param: any) => AggregationOperator;
      zip: (param: any) => AggregationOperator;
      and: (param: any) => AggregationOperator;
      not: (param: any) => AggregationOperator;
      or: (param: any) => AggregationOperator;
      cmp: (param: any) => AggregationOperator;
      eq: (param: any) => AggregationOperator;
      gt: (param: any) => AggregationOperator;
      gte: (param: any) => AggregationOperator;
      lt: (param: any) => AggregationOperator;
      lte: (param: any) => AggregationOperator;
      neq: (param: any) => AggregationOperator;
      cond: (param: any) => AggregationOperator;
      ifNull: (param: any) => AggregationOperator;
      switch: (param: any) => AggregationOperator;
      dateFromParts: (param: any) => AggregationOperator;
      dateFromString: (param: any) => AggregationOperator;
      dayOfMonth: (param: any) => AggregationOperator;
      dayOfWeek: (param: any) => AggregationOperator;
      dayOfYear: (param: any) => AggregationOperator;
      isoDayOfWeek: (param: any) => AggregationOperator;
      isoWeek: (param: any) => AggregationOperator;
      isoWeekYear: (param: any) => AggregationOperator;
      millisecond: (param: any) => AggregationOperator;
      minute: (param: any) => AggregationOperator;
      month: (param: any) => AggregationOperator;
      second: (param: any) => AggregationOperator;
      hour: (param: any) => AggregationOperator;
      week: (param: any) => AggregationOperator;
      year: (param: any) => AggregationOperator;
      literal: (param: any) => AggregationOperator;
      mergeObjects: (param: any) => AggregationOperator;
      objectToArray: (param: any) => AggregationOperator;
      allElementsTrue: (param: any) => AggregationOperator;
      anyElementTrue: (param: any) => AggregationOperator;
      setDifference: (param: any) => AggregationOperator;
      setEquals: (param: any) => AggregationOperator;
      setIntersection: (param: any) => AggregationOperator;
      setIsSubset: (param: any) => AggregationOperator;
      setUnion: (param: any) => AggregationOperator;
      concat: (param: any) => AggregationOperator;
      dateToString: (param: any) => AggregationOperator;
      indexOfBytes: (param: any) => AggregationOperator;
      indexOfCP: (param: any) => AggregationOperator;
      split: (param: any) => AggregationOperator;
      strLenBytes: (param: any) => AggregationOperator;
      strLenCP: (param: any) => AggregationOperator;
      strcasecmp: (param: any) => AggregationOperator;
      substr: (param: any) => AggregationOperator;
      substrBytes: (param: any) => AggregationOperator;
      substrCP: (param: any) => AggregationOperator;
      toLower: (param: any) => AggregationOperator;
      toUpper: (param: any) => AggregationOperator;
      meta: (param: any) => AggregationOperator;
      addToSet: (param: any) => AggregationOperator;
      avg: (param: any) => AggregationOperator;
      first: (param: any) => AggregationOperator;
      last: (param: any) => AggregationOperator;
      max: (param: any) => AggregationOperator;
      min: (param: any) => AggregationOperator;
      push: (param: any) => AggregationOperator;
      stdDevPop: (param: any) => AggregationOperator;
      stdDevSamp: (param: any) => AggregationOperator;
      sum: (param: any) => AggregationOperator;
      let: (param: any) => AggregationOperator;
  };
  project: {
      slice: (param: any) => ProjectionOperator;
      elemMatch: (param: any) => ProjectionOperator;
  };
};
declare class AggregationOperator {
  constructor(name: any, param: any);
}
declare class ProjectionOperator {
  constructor(name: any, param: any);
}

/**
 * 地理位置类型
*/
export interface GeoType {
    Point: typeof Geo.Point;
    LineString: typeof Geo.LineString;
    Polygon: typeof Geo.Polygon;
    MultiPoint: typeof Geo.MultiPoint;
    MultiLineString: typeof Geo.MultiLineString;
    MultiPolygon: typeof Geo.MultiPolygon;
}

/**
 * 数据库模块
 */
export declare class Db {
    /**
     * Geo 类型
     */
    Geo: GeoType;
    /**
     * 逻辑操作的命令
     */
    command: typeof Command;
    RegExp: any;
    serverDate: any;
    /**
     * 初始化
     *
     * @param config
     */
    config: any;
    get primaryKey(): string;
    static reqClass: any;
    static getAccessToken: Function;
    constructor(config?: any);
    /**
     * 获取集合的引用
     *
     * @param collName - 集合名称
     */
    collection(collName: string): CollectionReference;
    /**
     * 创建集合
     */
    createCollection(collName: string): any;
}

`
