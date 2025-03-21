import React from 'react';

interface RutTableProps {
  rutsByPrefix: Record<number, string[]>;
  usedRuts: string[];
  onCopy: (rut: string) => void;
}

const RutTable: React.FC<RutTableProps> = ({ rutsByPrefix, usedRuts, onCopy }) => (
  <div className="overflow-auto w-full justify-center flex">
    <table className="table-auto bg-white shadow-md rounded">
      <thead className="bg-gray-200 text-gray-600">
        <tr>
          {Object.keys(rutsByPrefix).map((prefix) => (
            <th key={prefix} className="px-4 py-2 text-left">{`${prefix}xxxxxx-x`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-100">
            {Object.keys(rutsByPrefix).map((prefix) => (
              <td
                key={prefix}
                className={`px-4 py-2 border-t text-gray-800 cursor-pointer ${
                  usedRuts.includes(rutsByPrefix[parseInt(prefix)][rowIndex]) ? 'bg-green-100' : ''
                }`}
                onClick={() => onCopy(rutsByPrefix[parseInt(prefix)][rowIndex])}
              >
                {rutsByPrefix[parseInt(prefix)][rowIndex] || ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RutTable;
