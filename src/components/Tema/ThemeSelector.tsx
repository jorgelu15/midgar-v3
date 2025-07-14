import React from "react";
import style from "./themeselector.module.css";
import { useTheme } from "../../context/ThemeContext/ThemeContext";

type ThemeOption = "light" | "dark";

const options: { label: string; value: ThemeOption }[] = [
  { label: "Predet.", value: "light" },
  { label: "Noche clara", value: "dark" },
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={style.container}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${style.option} ${theme === option.value ? style.selected : ""}`}
          onClick={() => setTheme(option.value)}
        >
          <p className={style.radio}>
            {theme === option.value && <span className={style.innerCheck} />}
          </p>
          <p className={style.label}>{option.label}</p>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
