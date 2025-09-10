import style from "./skeletoncard.module.css";

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

const SkeletonTable = ({ rows = 5, cols = 4 }: SkeletonTableProps) => {
  return (
    <table className={style["skeleton-table"]}>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r} className={style["skeleton-row"]}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} className={style["skeleton-cell"]}>
                <div className={`${style.skeleton} ${style["skeleton-box"]}`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkeletonTable;
