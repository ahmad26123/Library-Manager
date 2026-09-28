import { useEffect, useState } from "react";

export const useCrud = (service) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await service.getAll();
            setData(result || []);
        } catch (err) {
            setError("Failed to get data: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchData();
        };
        loadData();
    }, []);

    const addItem = async (newItem) => {
        setLoading(true);
        setError(null);
        try {
            await service.post(newItem);
            await fetchData();
            return true;
        } catch (err) {
            setError("Failed to add item: " + err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (id, updatedDataItem) => {
        setLoading(true);
        setError(null);
        try {
            await service.update(id, updatedDataItem);
            await fetchData();
            return true;
        } catch (err) {
            setError("Failed to update item: " + err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id, confirmMessage = "Are you sure !?") => {
        if (confirmMessage && !window.confirm(confirmMessage)) return false;

        setLoading(true);
        setError(null);
        try {
            await service.delete(id);
            await fetchData();
            return true;
        } catch (err) {
            setError("Failed to delete item: " + err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        addItem,
        updateItem,
        deleteItem,
        setData,
    };
};