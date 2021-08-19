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
import useStyles from './styles';
import { postEstadoProduto, put } from '../../services/apiClient';
import precoConvertido from '../../formatting/currency';

import carrinho from '../../assets/carrinho.svg';
import CustomCard from '../../components/customCard';
import iconeConfirma from '../../assets/iconeConfirma.svg';
import iconeSemPedido from '../../assets/semPedidos.svg';

export default function Address({
  id: idProduto,
  nome,
  descricao,
  preco,
  recarregarPag,
  imagem_produto: temImagem,
  valor_minimo_pedido: valorMinimo,
  tempo_entrega_minutos: tempoMinutos,
  taxa_entrega: taxaEntrega
}) {
  const [erro, setErro] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [addCarrinho, setAddCarrinho] = useState([]);
  const [subtotal, setSubtotal] = useState([]);
  const [open, setOpen] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const classes = useStyles();
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
  });

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

    // const { ...dadosAtualizados } = Object
    //   .fromEntries(Object
    //     .entries(data)
    //     .filter(([, value]) => value));
    console.log(data);
    try {
      // const { dados, ok } = await put(`/produtos/${idProduto}`, dadosAtualizados, token);
      // if (!ok) {
      //   setErro(dados);
      //   toast.error(dados);
      //   return;
      // }

      // if (ativou) {
      //   await postEstadoProduto(`/produtos/${idProduto}/ativar`, token);
      //   toast.warn('O produto foi ativado!');
      // } else {
      //   await postEstadoProduto(`/produtos/${idProduto}/desativar`, token);
      //   toast.warn('O produto foi desativado');
      // }

      setCarregando(false);
    } catch (error) {
      toast.error(error.message);
      setErro(error.message);
    }
    // setPedidoEnviado(true);
    // handleClose();
    // recarregarPag();
    toast.success('O pedido foi atualizado com sucesso!');
  }

  const endereco = '';
  const enderecoEnviado = true;

  return (
    <div onClick={(e) => stop(e)} className={classes.container}>
      <button
        id="btAddress"
        type="button"
        className="btLaranja mt2rem"
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
            <div className={`${enderecoEnviado ? 'enderecoEnviado' : 'none'} flexColumn contentCenter itemsCenter mt1rem`}>
              <img id="iconConfirma" src={iconeConfirma} alt="foto de ok" />
              <p>
                Endereço adicionado
                com sucesso!
              </p>
              <button className="btLaranja" type="button" onClick={handleClose}>
                Voltar para o carrinho
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
