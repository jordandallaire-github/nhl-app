import { useState } from 'react';

interface HeaderType {
  key: string;
  label: string;
  isReversed?: boolean;
}

interface SortableHeaderProps {
  children: React.ReactNode;
  onSort: () => void;
  isSortedAsc: boolean;
  isSortedDesc: boolean;
}

type SortDirection = 'asc' | 'desc';
type DataRow = {
  [key: string]: string | number | undefined | null;
};

const SortableHeader: React.FC<SortableHeaderProps> = ({ 
  children, 
  onSort, 
  isSortedAsc, 
  isSortedDesc 
}) => {
  return (
    <th onClick={onSort}>
      <div>
        {children}
        <span>
          {isSortedAsc ? '↓' : isSortedDesc ? '↑' : ''}
        </span>
      </div>
    </th>
  );
};

const convertTimeToSeconds = (timeString: string): number => {
  if (typeof timeString !== 'string' || !timeString.includes(':')) {
    return 0;
  }
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};

const parseValue = (value: string | number | undefined | null): string | number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  if (value === '--') return null;
  if (typeof value === 'string') {
    if (value.includes(':')) return convertTimeToSeconds(value);
    if (value.includes('%')) return parseFloat(value);
    if (!isNaN(parseFloat(value))) return parseFloat(value);
  }
  return value;
};

interface SortableTableProps {
  headers: HeaderType[];
  data: DataRow[];
  initialSortColumn: string;
}

const SortableTable: React.FC<SortableTableProps> = ({ 
  headers, 
  data, 
  initialSortColumn 
}) => {
  const [sortColumn, setSortColumn] = useState<string>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: string): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a: DataRow, b: DataRow) => {
    const aValue = parseValue(a[sortColumn]);
    const bValue = parseValue(b[sortColumn]);
    
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    const header = headers.find(h => h.key === sortColumn);
    const isReversed = header?.isReversed ?? false;

    let comparison: number;
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    if (isReversed) comparison = -comparison;
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <SortableHeader
              key={header.key}
              onSort={() => handleSort(header.key)}
              isSortedAsc={sortColumn === header.key && sortDirection === 'asc'}
              isSortedDesc={sortColumn === header.key && sortDirection === 'desc'}
            >
              {header.label}
            </SortableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header.key}>{row[header.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;