export class BaiseApi {
    constructor(url) {
        this.baseUrl = url;
    }
    //=====================================================================
    getAll = async () => {
        try {
            const response = await fetch(this.baseUrl);

            if (!response.ok) {
                throw new Error("rong :", response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error", error.message);
        }
    };
    //=====================================================================
    post = async (data) => {
        try {
            const response = await fetch(this.baseUrl, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("ERROR : ", response.status);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("ronnng : ", error.message);
        }
    };
    //=====================================================================
    getById = async (id) => {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error("rong :", response.status);
            }
            return await response.json();
        } catch (erorr) {
            console.error(erorr)
        }
    }
    //=====================================================================
    update = async (id, data) => {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("ERROR : ", response.status);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("ronnng : ", error.message);
        }
    };
    //=====================================================================
    delete = async (id) => {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("rong :", response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error", error.message);
        }
    };
}