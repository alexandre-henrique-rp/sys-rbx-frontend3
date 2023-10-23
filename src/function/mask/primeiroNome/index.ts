export const primeiroNome = (frase: string) => {
  if (!frase) {
    return '';
  }

  const indiceEspaco = Number(frase.indexOf(' '));
  if (indiceEspaco === -1) {
    return frase;
  }

  return frase.substring(0, indiceEspaco);
}