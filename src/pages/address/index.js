/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import '../../styles/global.css';
import './styles.css';
import Dialog from '@material-ui/core/Dialog';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaAddress } from '../../validation/schema';
import useStyles from './styles';
import useAuth from '../../hooks/useAuth';
import {
  patch, postAutenticado, postEstadoProduto, put
} from '../../services/apiClient';
import {
  toastEndereco, toastCep, toastComplemento
} from '../../validation/toastfy';

import carrinho from '../../assets/carrinho.svg';

export default function Address({ setTemEndereco }) {
  const [erro, setErro] = useState('');
  const [open, setOpen] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const classes = useStyles();
  const {
    user, token, rest
  } = useAuth();
  const customId = 'custom-id-yes';
  const {
    register, handleSubmit, formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: '',
    defaultValues: {},
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: yupResolver(schemaAddress)
  });

  if (errors.cep) {
    toastCep();
  }
  if (errors.endereco) {
    toastEndereco();
  }
  if (errors.complemento) {
    toastComplemento();
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function stop(e) {
    e.stopPropagation();
  }

  async function onSubmit(data) {
    setCarregando(true);
    setErro('');

    const { ...dadosAtualizados } = Object
      .fromEntries(Object
        .entries(data)
        .filter(([, value]) => value));
    dadosAtualizados.id = rest.id;
    dadosAtualizados.consumidor_id = user.ID;
    dadosAtualizados.consumidor_email = user.Email;

    try {
      const { dados, ok } = await postAutenticado('/consumidor/adicionarEndereco', dadosAtualizados, token);
      if (!ok) {
        setErro(dados);
        toast.error(dados);
        return;
      }

      setCarregando(false);
    } catch (error) {
      // toast.error(error.message);
      setErro(error.message);
    }
    setTemEndereco(data);
    // setPedidoEnviado(true);
    handleClose();
    // recarregarPag();
    toast.success('O endereço foi atualizado com sucesso!');
  }

  const enderecoEnviado = false;

  return (
    <div onClick={(e) => stop(e)} className={classes.container}>
      <button
        id="btAddress"
        type="button"
        className="btTransparente mt2rem"
        onClick={handleClickOpen}
      >
        Endereço
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className="flexColumn">
          <div className="bodyAddress flexColumn">
            <div className="topAddress flexRow posRelative gap2rem ">
              <img id="iconAddress" src={carrinho} alt="foto carrinho" />
              <h1>Adicionar Endereço</h1>
              <button id="btCrossAddress" className="btCross" type="button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className={`${enderecoEnviado ? 'none' : 'midCart'}`}>
              <div className=" conteinerEndereco px3rem">
                <div className="lineSpace" />
                <form>
                  <div className="flexColumn contentCenter px2rem">
                    <div className="flexColumn mb1rem ">
                      <label htmlFor="cep">CEP</label>
                      <input id="cep" type="number" {...register('cep')} />
                    </div>
                    <div className="flexColumn mb1rem ">
                      <label htmlFor="endereco">Endereço</label>
                      <input id="endereco" type="text" {...register('endereco')} />
                    </div>
                    <div className="flexColumn mb1rem ">
                      <label htmlFor="complemento">Complemento</label>
                      <input id="complemento" type="text" {...register('complemento')} />
                    </div>
                  </div>
                </form>
                <div className="lineSpace" />
                <div className="flexRow contentCenter itemsCenter">
                  <button id="btConfirmaEndereco" className="btLaranja" type="submit" onClick={handleSubmit(onSubmit)}>
                    Adicionar Endereço
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Dialog>
    </div>
  );
}
