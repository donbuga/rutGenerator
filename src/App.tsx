import React, { useState } from 'react';
import Header from './components/Header';
import RutTable from './components/RutTable';
import Footer from './components/Footer';
import { generateRut } from './utils/rutUtils';

const App: React.FC = () => {
  const [rutsByPrefix, setRutsByPrefix] = useState<Record<number, string[]>>({
    8: [],
    12: [],
    14: [],
    18: [],
    20: [],
  });
  const [usedRuts, setUsedRuts] = useState<string[]>([]);

  const generateRutList = () => {
    const prefixes = [8, 12, 14, 18, 20];
    const newRuts: Record<number, string[]> = {};
    prefixes.forEach((prefix) => {
      newRuts[prefix] = Array.from({ length: 20 }, () => generateRut(prefix));
    });
    setRutsByPrefix(newRuts);
    setUsedRuts([]); // Reset the used RUTs when regenerating the list
  };

  const copyToClipboard = (rut: string) => {
    navigator.clipboard.writeText(rut).then(() => {
      setUsedRuts((prev) => [...prev, rut]);
    });
  };

  React.useEffect(() => {
    generateRutList();
  }, [])

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
