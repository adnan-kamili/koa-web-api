import { Container, Inject, Service } from "typedi";

@Service()
export class Repository {
    connection: any;
    setConnection(connection: any) {
        this.connection = connection;
    }

    getRepository(entity: any) {
        return this.connection.getRepository(entity);
    }

    transaction(cb: (repository: Repository) => Promise<any>|any): Promise<any> {
        return this.connection.transaction(cb);
    }
}
