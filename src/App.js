import React, { useState } from 'react';

// Función para generar un RUT chileno válido con un prefijo específico
const generateRut = (prefix) => {
  const randomNumber = prefix * 1000000 + Math.floor(Math.random() * 1000000);
  const dv = calculateDV(randomNumber);
  return `${randomNumber}-${dv}`;
};

const calculateDV = (rut) => {
  let suma = 0;
  let multiplicador = 2;
  rut
    .toString()
    .split('')
    .reverse()
    .forEach((digit) => {
      suma += parseInt(digit, 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    });
  const resto = suma % 11;
  const dv = 11 - resto;
  return dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
};

const RutGenerator = () => {
  const [rutsByPrefix, setRutsByPrefix] = useState({ 8: [], 12: [], 14: [], 18: [], 20: [] });
  const [usedRuts, setUsedRuts] = useState([]);

  const generateRutList = () => {
    const prefixes = [8, 12, 14, 18, 20];
    const newRuts = {};
    prefixes.forEach((prefix) => {
      newRuts[prefix] = Array.from({ length: 20 }, () => generateRut(prefix));
    });
    setRutsByPrefix(newRuts);
    setUsedRuts([]); // Reset the used RUTs when regenerating the list
  };

  const copyToClipboard = (rut) => {
    navigator.clipboard.writeText(rut).then(() => {
      setUsedRuts((prev) => [...prev, rut]);
    });
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Generador de RUTs Chilenos</h1>
      </header>
      <main className="p-6">
        <div className="text-center mb-6">
          <button
            onClick={generateRutList}
            className="bg-blue-500 text-white px-6 py-2 rounded shadow-md hover:bg-blue-600 transition"
          >
            Generar RUTs
          </button>
        </div>
        <div className="overflow-auto">
          <table className="table-auto w-full bg-white shadow-md rounded">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">8xxxxxx-x</th>
                <th className="px-4 py-2 text-left">12xxxxxx-x</th>
                <th className="px-4 py-2 text-left">14xxxxxx-x</th>
                <th className="px-4 py-2 text-left">18xxxxxx-x</th>
                <th className="px-4 py-2 text-left">20xxxxxx-x</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">
                  {Object.keys(rutsByPrefix).map((prefix) => (
                    <td
                      key={prefix}
                      className={`px-4 py-2 border-t text-gray-800 cursor-pointer ${usedRuts.includes(rutsByPrefix[prefix][rowIndex]) ? 'bg-green-100' : ''}`}
                      onClick={() => copyToClipboard(rutsByPrefix[prefix][rowIndex])}
                    >
                      {rutsByPrefix[prefix][rowIndex] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="bg-gray-200 text-center py-4 mt-6">
        <p className="text-sm text-gray-600">Generador de RUTs &copy; 2025 / bugaDev</p>
      </footer>
    </div>
  );
};

export default RutGenerator;
