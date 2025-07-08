import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-200 text-center py-4 mt-6">
    <p className="text-sm text-gray-600">Generador de RUTs &copy; 2025 / bugaDev</p>
    <p className="text-sm text-gray-600 mt-2">
      Otras utilidades:
      {' '}
      <a
        href="https://donbuga.github.io/fake-json-generator/"
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fake json generator
      </a>
    </p>
  </footer>
);

export default Footer;
