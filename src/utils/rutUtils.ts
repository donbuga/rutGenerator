export const calculateDV = (rut: number): string => {
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
  
  export const generateRut = (prefix: number): string => {
    const randomNumber = prefix * 1000000 + Math.floor(Math.random() * 1000000);
    const dv = calculateDV(randomNumber);
    return `${randomNumber}-${dv}`;
  };
  