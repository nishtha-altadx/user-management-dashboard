import "./Table.css";

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderCell: (row: T, column: string) => React.ReactNode;
}

export const Table = <T,>({ headers, data, renderCell }: TableProps<T>) => {
  return (
    <div className="table-card">
      <table className="custom-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((column) => (
                <td key={column}>{renderCell(row, column)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
