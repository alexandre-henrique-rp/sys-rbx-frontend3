export const SetValue = (numero: string) => {
  return numero.replace(/[^0-9]/g, '');
}