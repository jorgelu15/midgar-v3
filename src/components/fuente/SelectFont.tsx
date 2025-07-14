import style from "./selectfont.module.css";
import { useTheme } from "../../context/ThemeContext/ThemeContext";

const SelectFont = () => {
  const { fontSize, setFontSize } = useTheme();

  const handleClick = (index: number) => {
    setFontSize(index as 0 | 1 | 2 | 3 | 4);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.sliderContainer}>
        <span className={style.label}>Aa</span>
        <div className={style.trackWrapper}>
          <div className={style.track}>
            <div
              className={style.filled}
              style={{ width: `${(fontSize / 4) * 100}%` }}
            />
          </div>
          <div className={style.points}>
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`${style.point} ${index <= fontSize ? style.selected : ""}`}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
        </div>
        <span className={style.label} style={{ fontSize: 24 }}>Aa</span>
      </div>
    </div>
  );
};

export default SelectFont;
