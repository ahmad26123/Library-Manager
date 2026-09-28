import { useState } from "react";
import { Books } from "../../Models/Books";

const BookForm = ({ authors = [], categories = [], onAddBook, loading }) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [authorId, setAuthorId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !authorId || !category) {
            alert("Please enter all required information!");
            return;
        }

        const newBook = new Books(null, title, authorId, category, true);
        const isAdded = await onAddBook(newBook);

        if (isAdded) {
            setTitle("");
            setCategory("");
            setAuthorId("");
        }
    };

    return (
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
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors disabled:bg-gray-400"
            >
                {loading ? "Processing..." : "➕ Add Book"}
            </button>
        </form>
    );
};

export default BookForm;