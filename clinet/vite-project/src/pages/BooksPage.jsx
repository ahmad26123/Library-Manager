import { useState } from "react";
import { BooksService } from "../service/BooksService";
import { AthoseService } from "../service/AuthoesService";
import { Books } from "../Models/Books";
import { useCrud } from "../Hooks/userCrud";

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

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [authorId, setAuthorId] = useState("");

  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthorId, setEditAuthorId] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [filterAuthorId, setFilterAuthorId] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !authorId || !category) {
      alert("Please enter all required information!");
      return;
    }

    const newBook = new Books(null, title, authorId, category, true);
    const isAdded = await addBook(newBook);

    if (isAdded) {
      setTitle("");
      setCategory("");
      setAuthorId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    await deleteBook(id);
  };

  const handleStartEdit = (book) => {
    setEditingBookId(book.id);
    setEditTitle(book.title || "");
    setEditAuthorId(book.authorld || book.authorId || "");
    setEditCategory(book.category || "");
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setEditTitle("");
    setEditAuthorId("");
    setEditCategory("");
  };

  const handleUpdate = async (book) => {
    if (!editTitle.trim() || !editAuthorId || !editCategory) {
      return alert("Please fill in all required fields.");
    }

    const updatedBook = new Books(
      book.id,
      editTitle,
      editAuthorId,
      editCategory,
      book.available ?? true
    );

    const isUpdated = await updateBook(book.id, updatedBook);
    if (isUpdated) {
      handleCancelEdit();
    }
  };

  const filteredBooks = books.filter((book) => {
    const bAuthorId = book.authorld || book.authorId;
    const matchesAuthor =
      filterAuthorId === "" || String(bAuthorId) === String(filterAuthorId);
    const matchesCategory =
      filterCategory === "" || book.category === filterCategory;
    return matchesAuthor && matchesCategory;
  });

  const getAuthorName = (id) => {
    const foundAuthor = authors.find((a) => String(a.id) === String(id));
    return foundAuthor ? foundAuthor.name : "Unknown Author";
  };

  const isLoading = booksLoading || authorsLoading;
  const error = booksError || authorsError;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-100 pb-4">
        📖 Library Books Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-700 mb-4">Add New Book</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Book Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Choose Author...</option>
            {authors.map((auth) => (
              <option key={auth.id} value={auth.id}>
                {auth.name}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Choose Category...</option>
            {CATEGORIES.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "➕ Add Book"}
        </button>
      </form>

      <div className="mb-6 p-4 bg-blue-50 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <span className="font-bold text-blue-900">🔍 Filter Books By:</span>

        <select
          value={filterAuthorId}
          onChange={(e) => setFilterAuthorId(e.target.value)}
          className="px-3 py-1.5 border border-blue-200 rounded-lg bg-white text-sm"
        >
          <option value="">All Authors</option>
          {authors.map((auth) => (
            <option key={auth.id} value={auth.id}>
              {auth.name}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 border border-blue-200 rounded-lg bg-white text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {(filterAuthorId || filterCategory) && (
          <button
            onClick={() => {
              setFilterAuthorId("");
              setFilterCategory("");
            }}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-4 text-blue-600 font-medium">Loading books...</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 mb-6">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase border-b">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No books match your criteria.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book, index) => (
                  <tr key={book.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{index + 1}</td>

                    {editingBookId === book.id ? (
                      <>
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full p-1 border border-blue-400 rounded focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <select
                            value={editAuthorId}
                            onChange={(e) => setEditAuthorId(e.target.value)}
                            className="w-full p-1 border border-blue-400 rounded bg-white focus:outline-none"
                          >
                            <option value="">Choose Author...</option>
                            {authors.map((auth) => (
                              <option key={auth.id} value={auth.id}>
                                {auth.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-4">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full p-1 border border-blue-400 rounded bg-white focus:outline-none"
                          >
                            <option value="">Choose Category...</option>
                            {CATEGORIES.map((cat, idx) => (
                              <option key={idx} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${book.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {book.available ? "Available" : "Borrowed"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(book)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded text-xs font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-2.5 py-1 rounded text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 font-semibold text-gray-800">{book.title}</td>
                        <td className="py-3 px-4">
                          {getAuthorName(book.authorld || book.authorId)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {book.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${book.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {book.available ? "Available" : "Borrowed"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleStartEdit(book)}
                            className="bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-100 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BooksPage;