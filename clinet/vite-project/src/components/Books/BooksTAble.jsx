import { useState } from "react";
import { Books } from "../../Models/Books";

const BooksTable = ({
    books = [],
    authors = [],
    categories = [],
    isLoading = false,
    error = null,
    onDeleteBook,
    onUpdateBook,
}) => {
    const [editingBookId, setEditingBookId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editAuthorId, setEditAuthorId] = useState("");
    const [editCategory, setEditCategory] = useState("");

    const [filterAuthorId, setFilterAuthorId] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        await onDeleteBook(id);
    };

    const handleStartEdit = (book) => {
        setEditingBookId(book.id);
        setEditTitle(book.title || "");
        setEditAuthorId(book.authorId || book.authorld || "");
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

        const isUpdated = await onUpdateBook(book.id, updatedBook);
        if (isUpdated) {
            handleCancelEdit();
        }
    };

    const filteredBooks = books.filter((book) => {
        const bAuthorId = book.authorId || book.authorld;
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

    return (
        <div>
            <div className="mb-6 p-4 bg-blue-50 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                <span className="font-bold text-blue-900">🔍 Filter Books By:</span>

                <select
                    value={filterAuthorId}
                    onChange={(e) => setFilterAuthorId(e.target.value)}
                    className="px-3 py-1.5 border border-blue-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="px-3 py-1.5 border border-blue-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
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
                <div className="text-center py-4 text-blue-600 font-medium">
                    Loading books...
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 mb-6 rounded">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 uppercase border-b text-xs">
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
                                    <tr
                                        key={book.id || index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
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
                                                        {categories.map((cat, idx) => (
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
                                                <td className="py-3 px-4 font-semibold text-gray-800">
                                                    {book.title}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getAuthorName(book.authorId || book.authorld)}
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

export default BooksTable;