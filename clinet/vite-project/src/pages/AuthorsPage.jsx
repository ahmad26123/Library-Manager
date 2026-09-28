import { useState } from "react";
import { AthoseService } from "../service/AuthoesService";
import { Athors } from "../Models/Authoes";
import { useCrud } from "../Hooks/userCrud";
const authorService = new AthoseService();

const AuthorsPage = () => {
  const {
    data: authors,
    loading,
    error,
    addItem: addAuthor,
    updateItem: updateAuthor,
    deleteItem: deleteAuthor,
  } = useCrud(authorService);

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");

  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editNationality, setEditNationality] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !nationality.trim()) {
      return alert("Please make sure all fields are filled.");
    }

    const newAuthor = new Athors(name, nationality);
    const isAdded = await addAuthor(newAuthor);

    if (isAdded) {
      setName("");
      setNationality("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;
    await deleteAuthor(id);
  };

  const handleStartEdit = (author) => {
    setEditingAuthorId(author.id);
    setEditName(author.name);
    setEditNationality(author.nationality);
  };

  const handleCancelEdit = () => {
    setEditingAuthorId(null);
    setEditName("");
    setEditNationality("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim() || !editNationality.trim()) {
      return alert("Fields cannot be empty.");
    }

    const updatedAuthor = new Athors(editName, editNationality, id);
    const isUpdated = await updateAuthor(id, updatedAuthor);

    if (isUpdated) {
      handleCancelEdit();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-100 pb-4">
        📚 Authors Management
      </h1>

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

      {loading && (
        <div className="flex justify-center items-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600 font-medium">Loading authors...</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
          <p className="font-medium">⚠️ Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal border-b border-gray-200">
                <th className="py-4 px-6 text-left font-semibold text-gray-700 w-16">#</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Name</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Nationality</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-700 w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {authors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">
                    No authors found. Add one above!
                  </td>
                </tr>
              ) : (
                authors.map((author, index) => (
                  <tr
                    key={author.id || index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-left font-medium text-gray-900">
                      {index + 1}
                    </td>

                    {editingAuthorId === author.id ? (
                      <>
                        <td className="py-2 px-6">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full p-1 border border-blue-400 rounded focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-6">
                          <input
                            type="text"
                            value={editNationality}
                            onChange={(e) => setEditNationality(e.target.value)}
                            className="w-full p-1 border border-blue-400 rounded focus:outline-none"
                          />
                        </td>
                        <td className="py-4 px-6 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(author.id)}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 text-left font-semibold text-gray-800">
                          {author.name}
                        </td>
                        <td className="py-4 px-6 text-left">
                          <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-medium">
                            {author.nationality}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleStartEdit(author)}
                            className="bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white transition-all duration-200 py-1.5 px-3 rounded-lg text-xs font-semibold shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(author.id)}
                            className="bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 py-1.5 px-3 rounded-lg text-xs font-semibold shadow-sm"
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

export default AuthorsPage;