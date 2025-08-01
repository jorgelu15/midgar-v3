import { useState } from "react";
import type { ProductoRepository } from "../models/Producto.repository";

export const useProductModals = () => {
    const [selectedProduct, setSelectedProduct] = useState<ProductoRepository | null>(null);
    const [isKardexModalOpen, setIsKardexModalOpen] = useState(false);
    const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
    const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
    const [isAbastecerModalOpen, setIsAbastecerModalOpen] = useState(false);

    return {
        selectedProduct,
        setSelectedProduct,
        isKardexModalOpen,
        setIsKardexModalOpen,
        isCreateProductModalOpen,
        setIsCreateProductModalOpen,
        isAdjustStockModalOpen,
        setIsAdjustStockModalOpen,
        setIsAbastecerModalOpen,
        isAbastecerModalOpen
    };
};