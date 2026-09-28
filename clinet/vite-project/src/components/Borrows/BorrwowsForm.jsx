
export const BorrowForm = ({
    availableBooks,
    selectedBookId,
    setSelectedBookId,
    borrowerName,
    setBorrowerName,
    returnDate,
    setReturnDate,
    todayDate,
    handleBorrow,
    isLoading,
}) => {
    return (
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
    );
};

