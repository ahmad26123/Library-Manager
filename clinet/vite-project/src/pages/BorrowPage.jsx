import { useState } from "react";
import { useCrud } from "../Hooks/userCrud";
import { BorrowsService } from "../service/BorrowsService";
import { BooksService } from "../service/BooksService";
import { Borrows } from "../Models/Borrows";
import { BorrowForm } from "../components/Borrows/BorrwowsForm";
import { BorrowsTable } from "../components/Borrows/BorrowsTable";

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

      <BorrowForm
        availableBooks={availableBooks}
        selectedBookId={selectedBookId}
        setSelectedBookId={setSelectedBookId}
        borrowerName={borrowerName}
        setBorrowerName={setBorrowerName}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        todayDate={todayDate}
        handleBorrow={handleBorrow}
        isLoading={isLoading}
      />

      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        borrows book
      </h2>

      <BorrowsTable
        borrows={borrows}
        getBookTitle={getBookTitle}
        editingBorrowId={editingBorrowId}
        editBorrowerName={editBorrowerName}
        setEditBorrowerName={setEditBorrowerName}
        editReturnDate={editReturnDate}
        setEditReturnDate={setEditReturnDate}
        todayDate={todayDate}
        handleSaveEdit={handleSaveEdit}
        setEditingBorrowId={setEditingBorrowId}
        handleStartEdit={handleStartEdit}
        handleReturnBook={handleReturnBook}
      />
    </div>
  );
};

export default BorrowsPage;