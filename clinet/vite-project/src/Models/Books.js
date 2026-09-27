export class Books {
    constructor(id, title, authorld, category, available = true) {
        this.id = id;
        this.title = title;
        this.authorld = authorld;
        this.category = category;
        this.available = available;
    }
}
