import { useState } from "react";
import style from "./table.module.css";
import prev from "../../assets/left.png"
import next from "../../assets/right.png"

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (row: T, index: any) => React.ReactNode;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
}

function Table<T>({
  headers,
  data,
  renderRow,
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 10,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalPages = Math.ceil(data?.length / rowsPerPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const paginatedRows = data?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <table className={style.table}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows?.map((row, i) => (
            <tr key={i}>{renderRow(row, i)}</tr>
          ))}
        </tbody>
      </table>

      <div className={style.pagination_controls}>
        <div>
          Mostrar:&nbsp;
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} filas
              </option>
            ))}
          </select>
        </div>
        <div className={style.pagination_buttons}>
          <button id={style.prevBtn} onClick={handlePrev} disabled={currentPage === 1}><img src={prev} /></button>
          <span>Página {currentPage} de {totalPages || 1}</span>
          <button id={style.nextBtn} onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}><img src={next} /></button>
        </div>
      </div>
    </>
  );
}

export default Table;
