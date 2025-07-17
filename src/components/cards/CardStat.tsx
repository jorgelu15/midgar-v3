import style from "./cardstat.module.css";

type CardStatProps = {
  title: string;
  children?: React.ReactNode;
  size?: '1/4' | '1/3' | '1/2' | '1';
};

const CardStat = ({ title, children, size = '1' }: CardStatProps) => {
  const sizeClass = style[`size_${size.replace('/', '_')}`];

  return (
    <div className={`${style.cardStat} ${sizeClass}`}>
      <div className={style.header}>
        <p className={style.title}>{title}</p>
      </div>
      <div className={style.chartContent}>
        {children}
      </div>
    </div>
  );
};

export default CardStat;
