export class Borrows {
    constructor(id, bookId, borrowerName, borrowDate, returnDate = null) {
        this.id = id;
        this.bookid = bookId;
        this.borrowername = borrowerName;
        this.borrowData = borrowDate;
        this.retunDate = returnDate;

    }
}