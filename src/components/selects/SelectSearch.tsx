import React, { useState, useRef, useEffect } from "react";
import style from "./selectsearch.module.css";

interface Option {
  label: string;
  value: string | number;
}

interface SelectSearchProps {
  options: Option[];
  placeholder?: string;
  onSelect: (option: Option) => void;
  value?: Option | null;
}

const SelectSearch: React.FC<SelectSearchProps> = ({ options, placeholder = "Seleccionar...", onSelect, value = null }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={style.select_container} ref={containerRef}>
      <div
        className={style.select_input}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value?.label || placeholder}
        <span className={style.arrow}>&#9662;</span>
      </div>

      {isOpen && (
        <div className={style.select_dropdown}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className={style.select_search}
            autoFocus
          />
          <div className="select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={style.select_option}
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className={style.select_no_option}>Sin resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectSearch;
