import { Container, Inject, Service } from "typedi";
import { BaseEntity } from '../models/BaseEntity';


@Service()
export class Repository {
    connection: any;
    setConnection(connection: any) {
        this.connection = connection;
    }

    getRepository(entity: any) {
        return this.connection.getRepository(entity);
    }
}