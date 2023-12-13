import { NextResponse } from "next/server";



export async function POST(request: Request) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const Prazo = searchParams.get('Prazo');
  const DescontoAdd: any = searchParams.get('DescontoAdd');
  const Frete: any = searchParams.get('Frete');

  try {
    const ListItens = body.itens;

    const ListaAtual = ListItens.filter((obj: any) => !!obj.id);
    const ListItensUltimo = ListaAtual[ListaAtual.length - 1];
    const semId = ListItens.filter((obj: any) => !obj.id);

    if (semId.length === 0) {

      const total = ListItens.reduce((acc: any, obj: any) => {
        const valor: number = obj.vOriginal;
        const qtd: number = obj.Qtd;
        const mont: boolean = obj.mont;
        const expo: boolean = obj.expo;
        const acrec: number =
          mont && expo ? 1.2 : expo && !mont ? 1.1 : !expo && mont ? 1.1 : 0;
        const somaAcrescimo: number = acrec === 0
          ? 0
          : (valor * acrec - valor) * qtd;
        const total1 = valor * qtd + somaAcrescimo;
        const total = Number(total1.toFixed(2))
        const somaTotal = acc + total
        const TotalConvert = Number(somaTotal.toFixed(2));
        return TotalConvert;
      }, 0);

      const Desconto = Prazo === 'Antecipado' ? ListItens.reduce((acc: any, obj: any) => {
        const valor = obj.vOriginal;
        const ValorGeral =
          Math.round(parseFloat(valor.toFixed(2)) * 100) / 100;
        const descont = ValorGeral * 0.05;
        const descont1 = descont * obj.Qtd;
        const somaDescontMin =
          Math.round(parseFloat(descont1.toFixed(2)) * 100) / 100;
        const retorno = acc + somaDescontMin
        return retorno
      }, 0) : 0;

      const valorTotal = total
      const ValorDesconto: number = Desconto
      const somaDecont = !!DescontoAdd ? parseFloat(DescontoAdd) + ValorDesconto : ValorDesconto
      const Soma = valorTotal - somaDecont
      const SomaArredondado = Math.round(Soma * 100) / 100

      const TotalRetono = SomaArredondado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      const DescontoRetorno = somaDecont.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

      return NextResponse.json({
        Total: TotalRetono,
        Desconto: DescontoRetorno,
        Lista: ListItens
      }, { status: 200 });


    } else {

      const [resposta] = semId
      const maxSum =
        ListItens.length > 1
          ? ListItensUltimo.id + 1
          : 1;
      resposta.id = maxSum;
      const valor1 = Number(resposta.vFinal.replace(".", "").replace(",", "."));
      const ValorGeral = valor1;
      const valor = Math.round(parseFloat(valor1.toFixed(2)) * 100) / 100;
      resposta.vOriginal = valor1;
      resposta.total = Math.round(parseFloat(ValorGeral.toFixed(2)) * 100) / 100;
      resposta.expo = false;
      resposta.mont = false;
      resposta.codg = resposta.prodId;
      resposta.Qtd = 1;
      const retorno = {
        ...resposta,

        total: Math.round(parseFloat(valor.toFixed(2)) * 100) / 100,
      };

      const ListaAtualizada = [...ListaAtual, retorno];

      const total = ListaAtualizada.reduce((acc: any, obj: any) => {
        const valor: number = obj.vOriginal;
        const qtd: number = obj.Qtd;
        const mont: boolean = obj.mont;
        const expo: boolean = obj.expo;
        const acrec: number =
          mont && expo ? 1.2 : expo && !mont ? 1.1 : !expo && mont ? 1.1 : 0;
        const somaAcrescimo: number = acrec === 0
          ? 0
          : (valor * acrec - valor) * qtd;
        const total1 = valor * qtd + somaAcrescimo;
        const total = Number(total1.toFixed(2))
        const somaTotal = acc + total
        const TotalConvert = Number(somaTotal.toFixed(2));
        return TotalConvert;
      }, 0);

      const Desconto = Prazo === 'Antecipado' ? ListaAtualizada.reduce((acc: any, obj: any) => {
        const valor = obj.vOriginal;
        const ValorGeral =
          Math.round(parseFloat(valor.toFixed(2)) * 100) / 100;
        const descont = ValorGeral * 0.05;
        const descont1 = descont * obj.Qtd;
        const somaDescontMin =
          Math.round(parseFloat(descont1.toFixed(2)) * 100) / 100;
        const retorno = acc + somaDescontMin
        return retorno
      }, 0) : 0;
      
      const valorTotal = total
      const ValorDesconto: number = Desconto
      const somaDecont = !!DescontoAdd ? parseFloat(DescontoAdd) + ValorDesconto : DescontoAdd
      const Soma = valorTotal - somaDecont
      const SomaArredondado = Math.round(Soma * 100) / 100

      const TotalRetono = SomaArredondado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      const DescontoRetorno = somaDecont.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

      return NextResponse.json({
        Total: TotalRetono,
        Desconto: DescontoRetorno,
        Lista: ListaAtualizada,
        frete: Frete
      }, { status: 200 });
    }

  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 });
  }
}