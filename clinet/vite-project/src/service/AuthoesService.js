import { BaiseApi } from "./BaiseApi";

export class AthoseService extends BaiseApi{
    constructor() {
        super("http://localhost:3001/authors")
    }
}