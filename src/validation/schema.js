import * as yup from 'yup';

const schemaLogin = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().min(8).required(),
});

const schemaCadastro = yup.object().shape({
  nome_usuario: yup.string().required(),
  email: yup.string().email().required(),
  telefone: yup.number().positive().integer().required(),
  senha: yup.string().min(8).required(),
  senhaConfere: yup.string().min(8).required(),
});

export { schemaCadastro, schemaLogin };
