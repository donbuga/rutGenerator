import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-200 text-center py-4 mt-6">
    <p className="text-sm text-gray-600">Generador de RUTs 
      - 8ug4Dev</p>
    <p className="text-sm text-gray-600">
      Otras utilidades:{' '}
      <a
        href="https://donbuga.github.io/fake-json-generator/"
        className="text-blue-500 hover:underline"
      >
        Fake json generator
      </a>
    </p>
  </footer>
);

export default Footer;
