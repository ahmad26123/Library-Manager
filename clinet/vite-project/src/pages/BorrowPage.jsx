import { useState } from "react";
import { useCrud } from "../Hooks/userCrud";
import { BorrowsService } from "../service/BorrowsService";
import { BooksService } from "../service/BooksService";
import { Borrows } from "../Models/Borrows";
const borrowsService = new BorrowsService();
const booksService = new BooksService();

export const BorrowsPage = () => {
  const {
    data: borrows,
    loading: borrowsLoading,
    error: borrowsError,
    addItem: addBorrow,
    updateItem: updateBorrow,
    deleteItem: deleteBorrow,
  } = useCrud(borrowsService);

  const {
    data: books,
    loading: booksLoading,
    updateItem: updateBook,
  } = useCrud(booksService);

  const todayDate = new Date().toISOString().split("T")[0];

  const [selectedBookId, setSelectedBookId] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [editingBorrowId, setEditingBorrowId] = useState(null);
  const [editBorrowerName, setEditBorrowerName] = useState("");
  const [editReturnDate, setEditReturnDate] = useState("");

  const availableBooks = books.filter((b) => b.available);

  const getBookTitle = (bookId) => {
    if (!bookId) return "not found !!";
    const book = books.find((b) => String(b.id) === String(bookId));
    return book ? book.title : "not found !!";
  };

  const handleBorrow = async (e) => {
    e.preventDefault();

    if (!selectedBookId || !borrowerName.trim()) {
      alert("Please enter the name and select a book!");
      return;
    }

    if (returnDate && returnDate < todayDate) {
      alert("Return date cannot be earlier than borrowing date!");
      return;
    }

    const newBorrow = new Borrows(
      null,
      selectedBookId,
      borrowerName.trim(),
      todayDate,
      returnDate || null
    );

    const isAdded = await addBorrow(newBorrow);

    if (isAdded) {
      const targetBook = books.find((b) => String(b.id) === String(selectedBookId));
      if (targetBook) {
        await updateBook(targetBook.id, { ...targetBook, available: false });
      }

      setSelectedBookId("");
      setBorrowerName("");
      setReturnDate("");
    }
  };

  const handleStartEdit = (borrow) => {
    setEditingBorrowId(borrow.id);
    setEditBorrowerName(borrow.borrowername || borrow.borrowerName || "");
    setEditReturnDate(borrow.retunDate || borrow.returnDate || "");
  };

  const handleSaveEdit = async (borrowItem) => {
    if (!editBorrowerName.trim()) return;

    const borrowDate = borrowItem.borrowData || borrowItem.borrowDate || todayDate;

    if (editReturnDate && editReturnDate < borrowDate) {
      alert("Return date cannot be earlier than borrowing date!");
      return;
    }

    const updatedData = {
      ...borrowItem,
      borrowername: editBorrowerName.trim(),
      retunDate: editReturnDate || null,
    };

    const isUpdated = await updateBorrow(borrowItem.id, updatedData);
    if (isUpdated) {
      setEditingBorrowId(null);
      setEditBorrowerName("");
      setEditReturnDate("");
    }
  };

  const handleReturnBook = async (borrowItem) => {
    if (!window.confirm("Are you sure to return this book?")) return;

    const isDeleted = await deleteBorrow(borrowItem.id, false);

    if (isDeleted) {
      const targetBook = books.find((b) => String(b.id) === String(borrowItem.bookid || borrowItem.bookId));
      if (targetBook) {
        await updateBook(targetBook.id, { ...targetBook, available: true });
      }
    }
  };

  const isLoading = borrowsLoading || booksLoading;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex justify-between items-center">
        <span>Book Borrowing and Returning Management</span>
        <span>📖</span>
      </h1>

      {borrowsError && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
          {borrowsError}
        </div>
      )}

      <form onSubmit={handleBorrow} className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Borrow a New Book
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Select Available Book:
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- chose book --</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Borrower Name:
            </label>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder=".. enter name of the borrow"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Return Date:
            </label>
            <input
              type="date"
              min={todayDate}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {isLoading ? "Adding..." : "done added"}
          </button>
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        borrows book
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">#</th>
              <th className="p-3">title</th>
              <th className="p-3">name of the borrow</th>
              <th className="p-3">date of the borrow</th>
              <th className="p-3">date for reback the book</th>
              <th className="p-3 text-center">.. setting</th>
            </tr>
          </thead>
          <tbody>
            {borrows.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No borrows found.
                </td>
              </tr>
            ) : (
              borrows.map((borrow, index) => {
                const isEditing = editingBorrowId === borrow.id;
                const itemBorrowDate = borrow.borrowData || borrow.borrowDate || todayDate;

                return (
                  <tr key={borrow.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3 font-medium text-gray-800">
                      {getBookTitle(borrow.bookid || borrow.bookId)}
                    </td>

                    <td className="p-3 text-gray-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editBorrowerName}
                          onChange={(e) => setEditBorrowerName(e.target.value)}
                          className="p-1 border rounded-md w-full text-center"
                        />
                      ) : (
                        borrow.borrowername || borrow.borrowerName || "not found !!"
                      )}
                    </td>

                    <td className="p-3 text-gray-600">
                      {itemBorrowDate}
                    </td>

                    <td className="p-3 text-gray-600">
                      {isEditing ? (
                        <input
                          type="date"
                          min={itemBorrowDate}
                          value={editReturnDate}
                          onChange={(e) => setEditReturnDate(e.target.value)}
                          className="p-1 border rounded-md text-center"
                        />
                      ) : (
                        borrow.retunDate || borrow.returnDate || "unselcted"
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(borrow)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium"
                          >
                            save
                          </button>
                          <button
                            onClick={() => setEditingBorrowId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded-md text-xs font-medium"
                          >
                            cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleStartEdit(borrow)}
                            className="px-3 py-1 bg-amber-500 text-white rounded-md text-xs font-medium flex items-center gap-1"
                          >
                            <span>edite</span> ✏️
                          </button>
                          <button
                            onClick={() => handleReturnBook(borrow)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-medium flex items-center gap-1"
                          >
                            <span>backe</span> ↩️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowsPage;