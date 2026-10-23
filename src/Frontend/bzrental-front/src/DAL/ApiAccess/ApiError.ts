import type IApiErrorDto from "./Models/IApiErrorDto";

export type ApiErrorTranslation = {
    code: string,
    msg: string
};

export class ApiError extends Error {
    public readonly status: number | null;
    public readonly errors: IApiErrorDto[];

    constructor(status: number | null, errors: IApiErrorDto[]) {
        super(errors[0]?.message ?? "Nieznany błąd");

        this.status = status;
        this.errors = errors;
    }

    public hasCode(code: string): boolean {
        return this.errors.some(x => x.code == code);
    }

    public getTranslations(translations: ApiErrorTranslation[]): string[] {
        const list: string[] = [];

        for (let tran of translations) {
            if (this.hasCode(tran.code))
                list.push(tran.msg);
        }

        return list;
    }
}