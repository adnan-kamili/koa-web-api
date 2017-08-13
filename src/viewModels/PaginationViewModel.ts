import { MaxLength, IsOptional, IsNumberString } from "class-validator";

export class PaginationViewModel {

    @IsOptional()
    @IsNumberString()
    page: any = "1";

    @IsOptional()
    @IsNumberString()
    limit: any = "10";

    @IsOptional()
    @MaxLength(256)
    sort: string = "";

    get skip() {
        this.page = parseInt(this.page, 10);
        this.page = (this.page < 0) ? 1 : this.page;
        return (this.page - 1) * parseInt(this.limit, 10);
    }

    get take() {
        this.limit = parseInt(this.limit, 10);
        this.limit = (this.limit < 0) ? 0 : this.limit;
        this.limit = (this.limit > 100) ? 100 : this.limit;
        return this.limit;
    }
}
