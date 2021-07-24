
export const cloudsdk_declare = `
import { AxiosStatic } from "axios";
import { Db } from "less-api-database";
import { FunctionContext, FunctionResult } from "../faas/types";
import { FileStorageInterface } from "../storage/interface";
import * as mongodb from "mongodb";
export declare type RequireFuncType = (module: string) => any;
export declare type InvokeFunctionType = (name: string, param: FunctionContext) => Promise<FunctionResult>;
export declare type EmitFunctionType = (event: string, param: any) => void;
export declare type GetTokenFunctionType = (payload: any) => string;
export declare type ParseTokenFunctionType = (token: string) => any | null;
export interface CloudSdkInterface {
    fetch: AxiosStatic;
    storage(namespace: string): FileStorageInterface;
    database(): Db;
    invoke: InvokeFunctionType;
    emit: EmitFunctionType;
    shared: Map<string, any>;
    getToken: GetTokenFunctionType;
    parseToken: ParseTokenFunctionType;
    mongodb: mongodb.Db;
}
declare const cloud: CloudSdkInterface;
export default cloud;
`
