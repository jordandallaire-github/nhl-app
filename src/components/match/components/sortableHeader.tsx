import React, { useState } from 'react';

const SortableHeader = ({ children, onSort, isSortedAsc, isSortedDesc }) => {
  return (
    <th onClick={onSort}>
      <div>
        {children}
        <span>
          {isSortedAsc ? '↑' : isSortedDesc ? '↓' : ''}
        </span>
      </div>
    </th>
  );
};

const convertTimeToSeconds = (timeString) => {
  if (typeof timeString !== 'string' || !timeString.includes(':')) {
    return 0;
  }
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};

const parseValue = (value) => {
  if (typeof value === 'number') return value;
  if (value === '--') return null;
  if (typeof value === 'string') {
    if (value.includes(':')) return convertTimeToSeconds(value);
    if (value.includes('%')) return parseFloat(value);
    if (!isNaN(parseFloat(value))) return parseFloat(value);
  }
  return value;
};

const SortableTable = ({ headers, data, initialSortColumn }) => {
  const [sortColumn, setSortColumn] = useState(initialSortColumn);
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = parseValue(a[sortColumn]);
    const bValue = parseValue(b[sortColumn]);
    
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    const header = headers.find(h => h.key === sortColumn);
    const isReversed = header?.isReversed ?? false;

    let comparison;
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    if (isReversed) comparison = -comparison;
    return sortDirection === 'desc' ? comparison : -comparison;
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