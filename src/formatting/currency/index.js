export default function precoConvertido(valor) {
  return (valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
