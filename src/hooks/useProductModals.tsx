import { useState } from "react";
import type { ProductoRepository } from "../models/Producto.repository";
import type { CuentaLavado } from "../models/CuentaLavado";

export const useProductModals = () => {
    const [selectedProduct, setSelectedProduct] = useState<ProductoRepository | null>(null);
    const [isKardexModalOpen, setIsKardexModalOpen] = useState(false);
    const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
    const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
    const [isAbastecerModalOpen, setIsAbastecerModalOpen] = useState(false);
    const [abrirCuenta, setAbrirCuenta] = useState(false);
    const [cuenta, setCuenta] = useState<CuentaLavado | null>(null);
    const [openModalCuenta, setOpenModalCuenta] = useState(false);
    const [generateReceipt, setGenerateReceipt] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(false);

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
        isAbastecerModalOpen,
        abrirCuenta,
        setAbrirCuenta,
        cuenta,
        setCuenta,
        openModalCuenta,
        setOpenModalCuenta,
        generateReceipt,
        setGenerateReceipt,
        editProduct,
        setEditProduct,
        deleteProduct,
        setDeleteProduct
    };
};