/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import '../../styles/global.css';
import './styles.css';
import Dialog from '@material-ui/core/Dialog';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import useStyles from './styles';
import { get, postAutenticado } from '../../services/apiClient';
import precoConvertido from '../../formatting/currency';
import useAuth from '../../hooks/useAuth';

import iconeCarrinho from '../../assets/carrinho.svg';
import CustomCard from '../../components/customCard';
import iconeSemPedido from '../../assets/semPedidos.svg';
import Address from '../address';
import OrderEdit from '../../components/orderEdit';

export default function Cart({
  carrinho,
  emptyCart,
  handleCarrinho,
  recarregarPag,
  subTotal,
  nomeAbrirCart
}) {
  const [erro, setErro] = useState('');
  const [temEndereco, setTemEndereco] = useState();
  const [open, setOpen] = useState(false);
  // const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const classes = useStyles();
  const customId = 'custom-id-yes';
  const {
    user,
    token,
    rest,
  } = useAuth();
  const carinhoVazio = carrinho.length === 0;
  const {
    handleSubmit
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

  useEffect(() => {
    async function buscarEndereco() {
      try {
        const { dados, ok } = await get('/consumidor/endereco', token);

        if (!ok) {
          toast.error(dados, { toastId: customId });
          return;
        }
        if (!dados) {
          return;
        }
        setTemEndereco(dados[0]);
      } catch (error) {
        toast.error(error.message, { toastId: customId });
      }
    }
    buscarEndereco();
  }, []);

  async function onSubmit(data) {
    setCarregando(true);
    setErro('');

    // TODO - verificar se ta ativo
    if (!temEndereco) {
      toast.error('É preciso informar um endereço para a entrega');
      return;
    }

    const { ...dadosAtualizados } = Object
      .fromEntries(Object
        .entries(data)
        .filter(([, value]) => value));

    dadosAtualizados.idRestaurante = rest.id;
    dadosAtualizados.idConsumidor = user.ID;
    dadosAtualizados.valorProdutos = subTotal;
    dadosAtualizados.taxaDeEntrega = taxaEntrega;
    dadosAtualizados.valorTotal = taxaEntrega + subTotal;
    dadosAtualizados.enderecoDeEntrega = JSON.stringify(temEndereco);
    dadosAtualizados.carrinho = carrinho;

    try {
      const { dados: listaDeProdutos } = await get(`/restaurate/${rest.id}/perfil`, token);

      const produtoAtivo = listaDeProdutos.find((item) => item.nome === item.nome.includes(carrinho) && item.ativo === true);

      if (produtoAtivo.length !== carrinho.length) {
        toast.error('Desculpe, nosso produto foi esgotado');
        recarregarPag();
        return;
      }

      // for (let item = 0; item < produtoAtivo.length; item += 1) if (listaDeProduto[item] !== carrinho[item]) return;

      const { dados, ok } = await postAutenticado('/consumidor/registrarPedido', dadosAtualizados, token);

      if (!ok) {
        setErro(dados);
        toast.error(dados);
        return;
      }

      setCarregando(false);
    } catch (error) {
      setErro(error.message);
    }
    emptyCart();
    recarregarPag();
    handleClose();
    toast.success('O pedido foi enviado com sucesso!');
  }

  const {
    categoria_id,
    email,
    nomeusuario,
    ...newRest
  } = rest;

  const {
    valor_minimo_pedido: valorMinimo,
    tempo_entrega_minutos: tempoMinutos,
    taxa_entrega: taxaEntrega,
    nome: nomeRestaurante,
    imagem_restaurante: avatarRestaurante,
  } = newRest;

  return (
    <div onClick={(e) => stop(e)} className={classes.container}>
      <button
        id="btOpenCart"
        type="button"
        className="btLaranja mt2rem"
        onClick={handleClickOpen}
      >
        {nomeAbrirCart}
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className="flexColumn">
          <div className="bodyCart flexColumn">
            <div className="topCart flexRow posRelative gap2rem ">
              <img id="iconCart" src={iconeCarrinho} alt="foto carrinho" />
              <h1>{nomeRestaurante}</h1>
              <button id="btCrossCart" className="btCross" type="button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className={`${temEndereco ? 'none' : 'conteinerFaltaEndereco'} px2rem flexRow itemsCenter ml3rem mb2rem`}>
              <Address setTemEndereco={setTemEndereco} />
            </div>
            <div className={`${temEndereco ? 'conteinerEndereco' : 'none'} px3rem mb2rem flewRow gap06rem`}>
              <span className="titleAddress">
                Endereço de entrega:
                {' '}
              </span>
              <span>
                { temEndereco && temEndereco.endereco }
                {' - '}
                { temEndereco && temEndereco.complemento }
                {' - '}
                { temEndereco && temEndereco.cep }
              </span>
            </div>
            <div className={`${carinhoVazio ? 'none' : 'midCart'}`}>
              <h4>
                Tempo de Entrega:
                <span className="spanTempoEntrega">
                  {' '}
                  { tempoMinutos }
                  {' '}
                </span>
                minutos, aproximadamente
              </h4>
              {/* TODO - display none */}
              <div className="none produtoNoCarrinho flexColumn contentCenter itemsCenter">
                <p>Pedido adicionado!</p>
              </div>
              {/* TODO - display none */}
              <div className={`${carinhoVazio ? 'none' : 'conteinerDetalhesProduto'} px3rem`}>
                <div className="cardsProdutos flexColumn gap1rem mt2rem contentCenter px2rem">
                  { carrinho.map((produto) => (
                    <div className="cardCart ">
                      <CustomCard
                        id="miniCard"
                        {...produto}
                        verificaAtivo="tem que por"
                      />
                      <OrderEdit
                        {...produto}
                        carrinho={carrinho}
                        subTotal={subTotal}
                        handleCarrinho={handleCarrinho}
                        avatarRestaurante={avatarRestaurante}
                        valorMinimo={valorMinimo}
                        tempoMinutos={tempoMinutos}
                        imagemProduto={produto.imagemProduto}
                      />
                    </div>
                  ))}
                </div>
                <div className="flexRow mt3rem contentCenter px2rem mb3rem">
                  <button id="btTransparenteCinza" type="button" onClick={handleClose}>Adicionar mais itens ao pedido</button>
                </div>
                <div className="lineSpace" />
                <form>
                  <div className="flexColumn contentCenter px2rem">
                    <div className="subTotal flexRow contentBetween mb06rem">
                      <span>Subtotal</span>
                      <span>{precoConvertido(subTotal)}</span>
                    </div>
                    <div className="taxaEntrega flexRow contentBetween mb1rem">
                      <span>Taxa de entrega</span>
                      <span>{precoConvertido(taxaEntrega)}</span>
                    </div>
                    <div className="total flexRow contentBetween mb06rem">
                      <span>Total</span>
                      <h2>{precoConvertido(subTotal + taxaEntrega)}</h2>
                    </div>
                    <div className="flexRow contentCenter itemsCenter">
                      <button id="btConfirmaPedido" className="btLaranja" type="submit" onClick={handleSubmit(onSubmit)}>
                        Confirmar pedido
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className={`${carinhoVazio ? 'semPedidos' : 'none'} flexColumn contentCenter itemsCenter mt1rem px3rem`}>
              <img id="iconSemPedidos" src={iconeSemPedido} alt="foto de ok" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
