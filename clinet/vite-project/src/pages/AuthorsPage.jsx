import { AthoseService } from "../service/AuthoesService";
import { useCrud } from "../Hooks/userCrud";
import AuthorForm from "../components/authors/AuthorForm";
import AuthorTable from "../components/authors/AuthorTable";
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


  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-100 pb-4">
        📚 Authors Management
      </h1>


      <AuthorForm onAddAuthor={addAuthor} loading={loading} />

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

      <AuthorTable
        authors={authors}
        onDeleteAuthor={deleteAuthor}
        onUpdateAuthor={updateAuthor}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AuthorsPage;