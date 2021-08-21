import * as yup from 'yup';

const schemaLogin = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().min(8).max(16).required(),
});

const schemaCadastro = yup.object().shape({
  nome_usuario: yup.string().required(),
  email: yup.string().email().required(),
  telefone: yup.number().positive().integer().min(11)
    .required(),
  senha: yup.string().min(8).max(16).required(),
  senhaConfere: yup.string().min(8).max(16).required(),
});

const schemaAddress = yup.object().shape({
  cep: yup.string().min(8).max(8).required()
    .matches(/^[0-9]+$/),
  endereco: yup.string().max(30).required(),
  complemento: yup.string().max(30).required(),
});

export { schemaCadastro, schemaLogin, schemaAddress };
