import React, { useState } from 'react';
import Header from './components/Header';
import RutTable from './components/RutTable';
import Footer from './components/Footer';
import { generateRut, calculateDV } from './utils/rutUtils';

const App: React.FC = () => {
  const [rutsByPrefix, setRutsByPrefix] = useState<Record<number, string[]>>({
    8: [],
    15: [],
    18: [],
    20: [],
    22: [],
  });
  const [usedRuts, setUsedRuts] = useState<string[]>([]);

  const generateRutList = () => {
    const prefixes = [8, 15, 18, 20, 22]; // Agregar prefijo 22
    const newRuts: Record<number, string[]> = {};

    prefixes.forEach((prefix) => {
      newRuts[prefix] = Array.from({ length: 10 }, () => {
        if (prefix === 20) {
          // Generar un RUT con el prefijo 20 y DV fijo en 0
          let rut;
          do {
            const baseRut = prefix * 1000000 + Math.floor(Math.random() * 1000000);
            rut = `${baseRut}-${calculateDV(baseRut)}`;
          } while (!rut.endsWith('-0')); // Asegurar que termine en -0
          return rut;
        }if (prefix === 22) {
          // Generar un RUT con el prefijo 22 y DV fijo en 8
          let rut;
          do {
            const baseRut = prefix * 1000000 + Math.floor(Math.random() * 1000000);
            rut = `${baseRut}-${calculateDV(baseRut)}`;
          } while (!rut.endsWith('-8')); // Asegurar que termine en -8
          return rut;
        }
        return generateRut(prefix);
      });
    });

    setRutsByPrefix(newRuts);
    setUsedRuts([]); // Resetear RUTs usados
  };

  React.useEffect(() => {
  generateRutList();
  }, []);

  const copyToClipboard = (rut: string) => {
    navigator.clipboard.writeText(rut).then(() => {
      setUsedRuts((prev) => [...prev, rut]);
    });
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen">
      <Header />
      <main className="p-6">
        <div className="text-center mb-6">
          <button
            onClick={generateRutList}
            className="bg-blue-500 text-white px-6 py-2 rounded shadow-md hover:bg-blue-600 transition"
          >
            Generar RUTs
          </button>
        </div>
        <RutTable rutsByPrefix={rutsByPrefix} usedRuts={usedRuts} onCopy={copyToClipboard} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
