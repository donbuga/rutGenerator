import React from 'react';
import { useMediaQuery } from 'react-responsive';

interface RutTableProps {
  rutsByPrefix: Record<number, string[]>;
  usedRuts: string[];
  randomNumbers: number[];
  onCopy: (rut: string) => void;
}

const RutTable: React.FC<RutTableProps> = ({
  rutsByPrefix,
  usedRuts,
  randomNumbers,
  onCopy,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const prefixes = Object.keys(rutsByPrefix);
  const displayPrefixes = isMobile ? prefixes.slice(-3) : prefixes;

  return (
    <div className="overflow-auto w-full justify-center flex">
      <table className="table-auto bg-white shadow-md rounded">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            {displayPrefixes.map((prefix) => (
              <th
                key={prefix}
                className="px-3 py-2 text-left text-sm md:text-base md:px-4"
              >{`${prefix}xxxxxx-x`}</th>
            ))}
            <th className="px-3 py-2 text-left text-sm md:text-base md:px-4">
              Número aleatorio
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }, (_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {displayPrefixes.map((prefix) => (
                <td
                  key={prefix}
                  className={`px-3 py-2 border-t text-gray-800 cursor-pointer text-sm md:text-base md:px-4 ${
                    usedRuts.includes(rutsByPrefix[parseInt(prefix)][rowIndex]) ? 'bg-green-100' : ''
                  }`}
                  onClick={() => onCopy(rutsByPrefix[parseInt(prefix)][rowIndex])}
                >
                  {rutsByPrefix[parseInt(prefix)][rowIndex] || ''}
                </td>
              ))}
              <td
                className="px-3 py-2 border-t text-gray-800 text-sm md:text-base md:px-4 cursor-pointer"
                onClick={() =>
                  randomNumbers[rowIndex] !== undefined &&
                  onCopy(randomNumbers[rowIndex].toString())
                }
              >
                {randomNumbers[rowIndex] || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RutTable;
