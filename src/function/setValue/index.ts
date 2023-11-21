export const SetValue = (numero: string) => {
  return !!numero && numero.replace(/[^0-9]/g, '');
}