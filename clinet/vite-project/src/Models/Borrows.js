export class Borrows {
    constructor(id, bookId, borrowerName, borrowDate, returnDate = null) {
        this.id = id;
        this.bookId = bookId;
        this.borrowerName = borrowerName;
        this.borrowData = borrowDate;
        this.retunDate = returnDate;

    }
}