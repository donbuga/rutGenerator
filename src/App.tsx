import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import RutTable from './components/RutTable';
import Footer from './components/Footer';
import { generateRut, calculateDV } from './utils/rutUtils';

const generateRandomEmail = (domain?: string): string => {
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
  const emailDomain = domain ?? `${Math.floor(10 + Math.random() * 90)}.cl`;
  return `${letters}${numbers}@${emailDomain}`;
};

const generateRandomEmails = (count: number): string[] => {
  const half = Math.floor(count / 2);
  const emails = [
    ...Array.from({ length: half }, () => generateRandomEmail('gmail.com')),
    ...Array.from({ length: count - half }, () => generateRandomEmail()),
  ];
  return emails.sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [rutsByPrefix, setRutsByPrefix] = useState<Record<number, string[]>>({
    8: [],
    15: [],
    18: [],
    20: [],
    22: [],
    25: [],
  });
  const [usedRuts, setUsedRuts] = useState<string[]>([]);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [randomEmails, setRandomEmails] = useState<string[]>([]);
  const [showAgeTable, setShowAgeTable] = useState(false);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const copyToastTimeoutRef = useRef<number | null>(null);

  const ageRanges = [
    { rutRange: '8M – 9M', age: '64–70' },
    { rutRange: '9M – 10M', age: '60–64' },
    { rutRange: '10M – 11M', age: '56–60' },
    { rutRange: '11M – 12M', age: '52–56' },
    { rutRange: '12M – 13M', age: '49–52' },
    { rutRange: '13M – 14M', age: '46–49' },
    { rutRange: '14M – 15M', age: '43–46' },
    { rutRange: '15M – 16M', age: '40–43' },
    { rutRange: '16M – 17M', age: '37–40' },
    { rutRange: '17M – 18M', age: '34–37' },
    { rutRange: '18M – 19M', age: '31–34' },
    { rutRange: '19M – 20M', age: '28–31' },
    { rutRange: '20M – 21M', age: '25–28' },
    { rutRange: '21M – 22M', age: '22–25' },
    { rutRange: '22M – 23M', age: '19–22' },
    { rutRange: '23M – 24M', age: '16–19' },
    { rutRange: '24M – 25M', age: '13–16' },
    { rutRange: '25M – 26M', age: '10–13' },
  ];

  const generateRutList = () => {
    const prefixes = [8, 15, 18, 20, 22, 25];
    const newRuts: Record<number, string[]> = {};
    const newRandoms: number[] = Array.from({ length: 10 }, () =>
      Math.floor(980000000 + Math.random() * 10000000)
    );
    const newEmails: string[] = generateRandomEmails(10);

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
        }
        if (prefix === 22) {
          // Generar un RUT con el prefijo 22 y DV fijo en 8
          let rut;
          do {
            const baseRut = prefix * 1000000 + Math.floor(Math.random() * 1000000);
            rut = `${baseRut}-${calculateDV(baseRut)}`;
          } while (!rut.endsWith('-8')); // Asegurar que termine en -8
          return rut;
        }
        if (prefix === 18) {
          // Generar un RUT con el prefijo 18 y DV fijo en 1
          let rut;
          do {
            const baseRut = prefix * 1000000 + Math.floor(Math.random() * 1000000);
            rut = `${baseRut}-${calculateDV(baseRut)}`;
          } while (!rut.endsWith('-1')); // Asegurar que termine en -1
          return rut;
        }
        return generateRut(prefix);
      });
    });

    setRutsByPrefix(newRuts);
    setRandomNumbers(newRandoms);
    setRandomEmails(newEmails);
    setUsedRuts([]); // Resetear RUTs usados
  };

  useEffect(() => {
    generateRutList();

    return () => {
      if (copyToastTimeoutRef.current) {
        window.clearTimeout(copyToastTimeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = (rut: string) => {
    navigator.clipboard.writeText(rut).then(() => {
      setUsedRuts((prev) => [...prev, rut]);
      setCopyToastVisible(false);

      if (copyToastTimeoutRef.current) {
        window.clearTimeout(copyToastTimeoutRef.current);
      }

      window.requestAnimationFrame(() => {
        setCopyToastVisible(true);
      });

      copyToastTimeoutRef.current = window.setTimeout(() => {
        setCopyToastVisible(false);
        copyToastTimeoutRef.current = null;
      }, 1100);
    });
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen relative">
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
        <RutTable
          rutsByPrefix={rutsByPrefix}
          usedRuts={usedRuts}
          randomNumbers={randomNumbers}
          randomEmails={randomEmails}
          onCopy={copyToClipboard}
        />
        <div className="max-w-2xl mx-auto mt-6">
          <button
            type="button"
            onClick={() => setShowAgeTable((prev) => !prev)}
            className="w-full flex items-center justify-between bg-white px-4 py-3 rounded shadow-md hover:bg-gray-50 transition"
            aria-expanded={showAgeTable}
            aria-controls="age-rut-table"
          >
            <span className="font-semibold">Edades aproximadas por rut</span>
            <span className="text-sm">{showAgeTable ? '▲' : '▼'}</span>
          </button>

          {showAgeTable && (
            <div id="age-rut-table" className="bg-white shadow-md rounded mt-2 overflow-hidden">
              <table className="table-auto w-full">
                <thead className="bg-gray-200 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Tramo RUT</th>
                    <th className="px-4 py-2 text-right">Edad aprox. en 2026</th>
                  </tr>
                </thead>
                <tbody>
                  {ageRanges.map(({ rutRange, age }) => (
                    <tr key={rutRange} className="border-t">
                      <td className="px-4 py-2 font-semibold">{rutRange}</td>
                      <td className="px-4 py-2 text-right font-semibold">{age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span className={copyToastVisible ? 'copy-toast-message copy-toast-message--active' : 'copy-toast-message'}>
          Copiado
        </span>
      </div>
    </div>
  );
};

export default App;
