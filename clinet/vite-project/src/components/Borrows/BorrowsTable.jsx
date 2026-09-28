
export const BorrowsTable = ({
    borrows,
    getBookTitle,
    editingBorrowId,
    editBorrowerName,
    setEditBorrowerName,
    editReturnDate,
    setEditReturnDate,
    todayDate,
    handleSaveEdit,
    setEditingBorrowId,
    handleStartEdit,
    handleReturnBook,
}) => {
    return (
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
    );
};