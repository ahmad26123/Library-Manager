import { BaiseApi } from "./BaiseApi";

export class BooksService extends BaiseApi {
    constructor() {
        super("http://localhost:3001/books");
    }

    updateAvilability = async (bookId, available) => {
        try {
            const response = await fetch(`${this.url}/${bookId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "appliaction/json",
                },
                body: JSON.stringify({ available: available }),
            });
            if (!response.ok) {
                throw new Error("rongge :", response.status);
            }
            return await response.json();
        } catch (erorr) {
            console.error("sime thing rong :", erorr);
        }
    };
}
