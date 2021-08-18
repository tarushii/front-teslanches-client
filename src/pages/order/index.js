/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Dialog from '@material-ui/core/Dialog';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import minusIcon from '../../assets/minusIcon.svg';
import plusIcon from '../../assets/plusIcon.svg';
import { postEstadoProduto, put } from '../../services/apiClient';
import useStyles from './styles';
import '../../styles/global.css';
import './styles.css';

import avatarRestaurante from '../../assets/avatar-padrao.gif'; // TODO - vir do back
import fotoProduto from '../../assets/imageProduto.svg'; // TODO - vir do back
import iconRelogio from '../../assets/relogio.svg';
import iconMoney from '../../assets/money.svg';
import carrinho from '../../assets/carrinho.svg';

export default function DetalheProduto({ recarregarPag }) {
  const [erro, setErro] = useState('');
  const [quantidade, setQuantidade] = useState(0);
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

    const { ...dadosAtualizados } = Object
      .fromEntries(Object
        .entries(data)
        .filter(([, value]) => value));

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

    handleClose();
    recarregarPag();
    toast.success('O pedido foi atualizado com sucesso!');
  }

  return (
    <div onClick={(e) => stop(e)} className={classes.container}>
      <button
        id="btDeAbrir"
        type="button"
        className="btLaranja mt2rem"
        onClick={handleClickOpen}
      >
        card do produto
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className="flexColumn">
          <div className="bodyDetalheProduto flexColumn gap3rem ">
            <div className="conteinerFotoProduto posRelative mb3rem">
              <img id="fotoProduto" src={fotoProduto} alt="foto do produto" className="fotoProduto" />
              <img className="avatarDetalheRestaurante" src={avatarRestaurante} alt="avatar do restaurante" />
              <button className="btCross" type="button" onClick={handleClose}>
                &times;
              </button>
            </div>
            {/* TODO - display none */}
            <div className="none produtoAdicionadoCarrinho flexColumn contentCenter itemsCenter">
              <img src={carrinho} alt="foto carrinho" />
              <p>Pedido adicionado!</p>
            </div>
            {/* TODO - display none */}
            <div className=" conteinerdetalhesProduto px3rem">
              <h1>Nome do produto</h1>
              <div className="flexRow mt2rem contentBetween px2rem">
                <span className="flexRow itemsCenter gap1rem">
                  <img src={iconMoney} id="iconMoney" alt="icone dinheiro" />
                  Pedido minimo: R$ 30,00
                </span>
                <span className="flexRow itemsCenter gap1rem">
                  <img src={iconRelogio} id="iconRelogio" alt="icone relogio" />
                  tempo de entrega: 1h - 1,5h
                </span>
              </div>
              <form>
                <div className="flexRow mt3rem contentBetween px2rem mb3rem">
                  <p>
                    Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit ut aliquam,
                    purus sit amet luctus venenatis
                  </p>
                  <span id="conteinerPreco">$99,99</span>
                </div>
                <div className="flexRow contentBetween itemsCenter px2rem">
                  <div className="boxQuantidade flexRow contentBetween mt2rem">
                    <button id="minus" type="button" onClick={() => setQuantidade(Math.max(quantidade - 1, 0))}><img id="minusIcon" src={minusIcon} alt="minus icon" /></button>
                    <span id="textoQuantidade">{quantidade}</span>
                    <button id="plus" type="button" onClick={() => setQuantidade(quantidade + 1)}><img id="plusIcon" src={plusIcon} alt="plus icon" /></button>
                  </div>
                  <button id="btAddCarrinho" className="btLaranja" type="submit" onClick={handleSubmit(onSubmit)}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </form>
            </div>
            <div className="flexRow contentCenter mt1rem">
              <button id="btTransparenteCinza" type="submit">Ir para a revisão do pedido</button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
