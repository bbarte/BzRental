export default class Validator {
    public errors: string[] = [];

    public addIfStringIsNullOrWhitespace(str: string, message: string) {
        if (str == null || str.trim() === '') {
            this.errors.push(message);
        }
    }

    public isValid(): boolean {
        return this.errors.length === 0;
    }
}