import { useState } from "react";
import style from "./table.module.css";
import status from "../../assets/status.svg";
import borrar from "../../assets/borrar.svg";
import prev from "../../assets/left.png";
import next from "../../assets/right.png";

interface TableProps {
  header_items?: string[];
  row_items?: string[][];
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  actions?: (userId: string) => void;
}

const Table = ({
  header_items = [],
  row_items = [],
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 10,
  actions
}: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalPages = Math.ceil(row_items.length / rowsPerPage);

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

  const paginatedRows = row_items.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <table>
        <thead>
          <tr>
            {header_items.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cellIndex !== row.length - 1 ? (
                    cell
                  ) : (
                    actions && (
                      <>
                        <img src={status} onClick={() => actions(row[0])} />
                        <img src={borrar} />
                      </>
                    )
                  )}

                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className={style.pagination_controls}>
        <div>
          Mostrar:&nbsp;
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            id={style.rowsPerPage}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} filas
              </option>
            ))}
          </select>
        </div>
        <div className={style.pagination_buttons}>
          <button
            id={style.prevBtn}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            <img src={prev} />
          </button>
          <span id="pageInfo">
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            id={style.nextBtn}
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <img src={next} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
