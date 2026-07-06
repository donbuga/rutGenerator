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
  const [rutAgeInput, setRutAgeInput] = useState('');
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const copyToastTimeoutRef = useRef<number | null>(null);

  const rutWithoutVerifier = rutAgeInput.includes('-')
    ? rutAgeInput.split('-')[0].replace(/\D/g, '')
    : rutAgeInput.replace(/\D/g, '').slice(0, 8);
  const numericRut = Number(rutWithoutVerifier);
  const hasValidRutNumber = Number.isFinite(numericRut) && numericRut > 0;
  const estimatedBirthYear = hasValidRutNumber
    ? Math.round(1930 + 3.5 * (numericRut / 1000000))
    : null;
  const estimatedAge = estimatedBirthYear !== null ? Math.round(2026 - estimatedBirthYear) : null;

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
        <section className="max-w-2xl mx-auto mt-6 bg-white rounded-lg shadow-md p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Estimador de edad</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">Calcula la edad aproximada por RUT</h2>
            <p className="text-gray-600 mt-2">
              Ingresa un RUT chileno con puntos, guion o solo números para ver la estimación automáticamente.
            </p>
          </div>

          <label htmlFor="rut-age-input" className="block text-sm font-semibold text-gray-700 mb-2">
            RUT
          </label>
          <input
            id="rut-age-input"
            type="text"
            inputMode="text"
            value={rutAgeInput}
            onChange={(event) => setRutAgeInput(event.target.value)}
            placeholder="Ej: 12.345.678-9"
            className="w-full rounded border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <div className="grid gap-3 sm:grid-cols-3 mt-5">
            <div className="rounded bg-gray-50 p-4 border border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500">RUT ingresado</p>
              <p className="text-lg font-semibold text-gray-800 break-words">{rutAgeInput || '—'}</p>
            </div>
            <div className="rounded bg-gray-50 p-4 border border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500">Año estimado</p>
              <p className="text-lg font-semibold text-gray-800">{estimatedBirthYear ?? '—'}</p>
            </div>
            <div className="rounded bg-blue-50 p-4 border border-blue-100">
              <p className="text-xs uppercase tracking-wide text-blue-600">Edad estimada</p>
              <p className="text-lg font-semibold text-blue-700">{estimatedAge !== null ? `${estimatedAge} años` : '—'}</p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
            Este cálculo es una estimación basada en el número de RUT y puede presentar un margen de error de varios años.
          </p>
        </section>
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
