import { Athors } from "../../Models/Authoes";
import { useState } from "react";


const AuthorForm = ({ onAddAuthor, loading }) => {
    const [name, setName] = useState("");
    const [nationality, setNationality] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !nationality.trim()) {
            return alert("Please make sure all fields are filled.");
        }

        const newAuthor = new Athors(name, nationality);

        const isAdded = await onAddAuthor(newAuthor);

        if (isAdded) {
            setName("");
            setNationality("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 flex flex-col md:flex-row gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
        >
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Author Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Nationality..."
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center whitespace-nowrap disabled:bg-gray-400"
            >
                {loading ? "Processing..." : "➕ Add Author"}
            </button>
        </form>
    );
};
export default AuthorForm
