// hooks/useTitle.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { routeTitles } from "../utils/titles";

export function useTitle() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const title = routeTitles[currentPath] || "Midgar ERP"; // default
    document.title = title;
  }, [location]);
}