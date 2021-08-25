import { toast } from 'react-toastify';

const customId = 'custom-id-yes';

function toastNome() {
  toast.error('O campo nome é obrigatorio', { toastId: customId });
}
function toastEmail() {
  toast.error('Um e-mail válido é obrigatorio', { toastId: customId });
}
function toastTelefone() {
  toast.error('O campo telefone é obrigatorio', { toastId: customId });
}
function toastSenha() {
  toast.error('O campo senha é obrigatorio, com no minimo 8 caracteres', { toastId: customId });
}
function toastSenhaConfere() {
  toast.error('Repita a senha, com no minimo 8 caracteres', { toastId: customId });
}
function toastDescricao() {
  toast.error('O campo descrição é obrigatorio', { toastId: customId });
}
function toastPreco() {
  toast.error('O campo proço é obrigatorio', { toastId: customId });
}
function toastTaxaDeEntrega() {
  toast.error('O taxa de entrega é obrigatorio', { toastId: customId });
}
function toastCep() {
  toast.error('O CEP é obrigatorio e precisa ter 8 digitos', { toastId: customId });
}
function toastEndereco() {
  toast.error('O endereço é obrigatorio e com maximo de 30 caracteres', { toastId: customId });
}
function toastComplemento() {
  toast.error('O complemento é obrigatorio e com maximo de 30 caracteres', { toastId: customId });
}

export {
  toastDescricao,
  toastEmail,
  toastNome,
  toastPreco,
  toastSenha,
  toastSenhaConfere,
  toastTaxaDeEntrega,
  toastTelefone,
  toastCep,
  toastEndereco,
  toastComplemento
};
