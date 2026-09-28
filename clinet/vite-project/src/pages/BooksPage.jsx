// import { useState } from "react";
import { BooksService } from "../service/BooksService";
import { AthoseService } from "../service/AuthoesService";
// import { Books } from "../Models/Books";
// import { useCrud } from "../Hooks/userCrud";
import { useCrud } from "../Hooks/userCrud";
// import BooksTable from "../components/Books/BooksTAble";
import BooksTable from "../components/Books/BooksTAble";
// import BookForm from "../components/Books/BooksForm";
import BookForm from "../components/Books/BooksForm";
const bookService = new BooksService();
const authorService = new AthoseService();

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Technology",
  "Novel",
  "Philosophy",
  "Biography",
];

const BooksPage = () => {
  const {
    data: books,
    loading: booksLoading,
    error: booksError,
    addItem: addBook,
    updateItem: updateBook,
    deleteItem: deleteBook,
  } = useCrud(bookService);

  const {
    data: authors,
    loading: authorsLoading,
    error: authorsError,
  } = useCrud(authorService);

  const isLoading = booksLoading || authorsLoading;
  const error = booksError || authorsError;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-100 pb-4">
        📖 Library Books Management
      </h1>

      <BookForm
        authors={authors}
        categories={CATEGORIES}
        onAddBook={addBook}
        loading={isLoading}
      />

      <BooksTable
        books={books}
        authors={authors}
        categories={CATEGORIES}
        isLoading={isLoading}
        error={error}
        onDeleteBook={deleteBook}
        onUpdateBook={updateBook}
      />
    </div>
  );
};
export default BooksPage;