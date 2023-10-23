

export const Calculo = (Valor: any) => {
  const perdido_reduce = Valor.reduce((acc: number, d: any) => {
    const budgetString = d.attributes.Budget;
    const budget = budgetString !== null ? parseFloat(budgetString.replace(/[^0-9,]/g, "").replace(".", "").replace(",", ".")) : 0;
    return acc + budget;
  }, 0);

  const pedido = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(perdido_reduce);

  return pedido;
}
