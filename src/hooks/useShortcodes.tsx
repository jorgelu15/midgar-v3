import { useEffect } from "react";

export function useShortcuts(shortcuts: Record<string, () => void>) {
    const parseKeyCombo = (e: KeyboardEvent): string => {
        let combo = '';
        if (e.ctrlKey) combo += 'Ctrl+';
        if (e.altKey) combo += 'Alt+';
        if (e.shiftKey) combo += 'Shift+';

        // Normalizamos e.key (para letras simples)
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key; // 'a', 'b', 'Enter', etc.
        return combo + key;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyCombo = parseKeyCombo(e); // combina modificadores con key
            const rawKey = e.key.toLowerCase(); // por si usan solo letras simples

            // Intentamos con combinación completa primero (Ctrl+n, Alt+a...)
            if (shortcuts[keyCombo]) {
                e.preventDefault();
                shortcuts[keyCombo]();
            }
            // Si no hay modificadores, intentamos solo la tecla suelta ("a", "Enter", etc.)
            else if (!e.ctrlKey && !e.altKey && !e.shiftKey && shortcuts[rawKey]) {
                e.preventDefault();
                shortcuts[rawKey]();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [shortcuts]);
}
