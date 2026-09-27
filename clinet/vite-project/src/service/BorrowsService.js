import { BaiseApi } from "./BaiseApi";

export class BorrowsService extends BaiseApi {
    constructor() {
        super("http://localhost:3001/borrows");
    }
}