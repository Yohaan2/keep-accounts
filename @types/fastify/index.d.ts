import { JWT } from "@fastify/jwt";
import fastify, { FastifyRequest } from 'fastify';
import { UserEntity } from "../../src/domain";

declare module 'fastify' {
  export interface FastifyRequest {
    jwt: JWT,
  }
  export interface FastifyInstance  {
    authenticate: any
  }
}