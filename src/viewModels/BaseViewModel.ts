import { Exclude } from "class-transformer";

export class BaseViewModel {

    @Exclude()
    id: number;
}
