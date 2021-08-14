/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './styles.css';
import '../../styles/global.css';
import { React, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { postAutenticado } from '../../services/apiClient';
import { schemaCadastro } from '../../validation/schema';
import AuthContext from '../../context/AuthContext';
import imageCenter from '../../assets/img-center-register.svg';
import imageLogo from '../../assets/logo-register.svg';

export default function SingUp() {
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { token } = useContext(AuthContext);
  const toastOk = 'ok';
  const toastErro = 'erro';
  const {
    register, handleSubmit, formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaCadastro)
  });

  async function onSubmit(data) {
    setCarregando(true);
    setErro('');

    try {
      const { dados, ok } = await postAutenticado('/cadastro', data, token);
      if (!ok) {
        setErro(dados);
        toast.error(dados, { toastId: toastErro });
        return;
      }

      setCarregando(false);
    } catch (error) {
      toast.error(error.message, { toastId: toastErro });
      setErro(error.message);
    }
    recarregarPag();
    handleClose();
    toast.success('Cadastro realizado com sucesso', { toastId: toastOk });
  }

  toast.error(errors.nome?.message, { toastId: toastErro });
  toast.error(errors.telefone?.message, { toastId: toastErro });
  toast.error(errors.email?.message, { toastId: toastErro });
  toast.error(errors.senha?.message, { toastId: toastErro });
  toast.error(errors.senhaConfere?.message, { toastId: toastErro });

  return (
    <article className="telaRegistro">
      <img id="logoRegister" src={imageLogo} alt="imagem logo do restaurante" />
      <img id="centroRegister" src={imageCenter} alt="imagem garota olhando celular" />
      <section className="telaRegistroFormulario">
        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="mb1rem">Novo produto</h1>
            <div className="flexColunm mb1rem ">
              <label htmlFor="nomeRestaurante">Nome</label>
              <input id="nomeRestaurante" type="text" {...register('nome', { required: true })} />
            </div>
            <div className="flexColunm mb1rem ">
              <label htmlFor="nomeRestaurante">Nome</label>
              <input id="nomeRestaurante" type="text" {...register('nome', { required: true })} />
            </div>
            <div className="flexColunm mb1rem ">
              <label htmlFor="telefone">telefone</label>
              <input id="telefone" type="number" {...register('telefone', { required: true })} />
            </div>
            <div className="flexColunm mb1rem ">
              <label htmlFor="senha">Senha</label>
              <input id="senha" type="password" {...register('senha', { required: true, minLength: 8 })} />
            </div>
            <div className="flexColunm mb1rem ">
              <label htmlFor="senhaConfere">Repita a senha</label>
              <input id="senhaConfere" type="text" {...register('senhaConfere', { required: true, minLength: 8 })} />
            </div>
          </form>
        </main>
        <footer>
          <button className="btLaranja" type="submit" onClick={handleSubmit(onSubmit)}>Criar conta</button>
          <p className="retornarLogin">
            Já tem uma conta?
            <Link to="/">  Fazer login</Link>
          </p>
        </footer>
      </section>
    </article>
  );
}
