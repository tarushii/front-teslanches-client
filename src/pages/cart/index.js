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
import Order from '../order';
import useAuth from '../../hooks/useAuth';

import iconeCarrinho from '../../assets/carrinho.svg';
import CustomCard from '../../components/customCard';
// import iconeConfirma from '../../assets/iconeConfirma.svg';
import iconeSemPedido from '../../assets/semPedidos.svg';
import Address from '../address';

export default function Cart({
  carrinho,
  emptyCart,
  descricao,
  restaurante,
  handleCarrinho,
  recarregarPag,
  imagemProduto,
  subTotal,

  nomeAbrirCart
}) {
  const [erro, setErro] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [addCarrinho, setAddCarrinho] = useState([]);
  const [temEndereco, setTemEndereco] = useState([]);
  const [open, setOpen] = useState(false);
  // const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const classes = useStyles();
  const customId = 'custom-id-yes';
  const {
    user, adicionarNoCarrinho, removerDoCarrinho, token, cart, rest
  } = useAuth();
  const carinhoVazio = carrinho.length === 0;
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

  useEffect(() => {
    async function buscarEndereco() {
      try {
        const { dados, ok } = await get(`/consumidor/${user.ID}/endereco`, token);

        if (!ok) {
          toast.error(dados, { toastId: customId });
          return;
        }
        if (!dados) {
          return;
        }
        setTemEndereco(dados);
      } catch (error) {
        toast.error(error.message, { toastId: customId });
      }
    }
  }, []);

  async function onSubmit(data) {
    setCarregando(true);
    setErro('');

    // TODO - verificar se ta ativo
    if (temEndereco.length === 0) {
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
      const { dados, ok } = await postAutenticado('/consumidor/registrarPedido', dadosAtualizados, token);

      if (!ok) {
        setErro(dados);
        toast.error(dados);
        return;
      }

      setCarregando(false);
    } catch (error) {
      toast.error(error.message);
      setErro(error.message);
    }
    handleClose();
    emptyCart();
    recarregarPag();
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
            <div className={`${temEndereco.length === 0 ? 'conteinerFaltaEndereco' : 'none'} px2rem flexRow itemsCenter ml3rem mb2rem`}>
              <Address setTemEndereco={setTemEndereco} />
            </div>
            <div className={`${temEndereco.length === 0 ? 'none' : 'conteinerEndereco'} px3rem mb2rem flewRow gap06rem`}>
              <span>
                CEP
                {' '}
                { temEndereco.cep }
                {' '}
              </span>
              <span>
                {' '}
                Endereço
                {' '}
                { temEndereco.endereco }
                {' '}
              </span>
              <span>
                {' '}
                Complemento
                {' '}
                { temEndereco.complemento }
                {' '}
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
                      <Order
                        carrinho={carrinho}
                        subTotal={subTotal}
                        {...cart}
                        {...newRest}
                        handleCarrinho={handleCarrinho}
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
            {/* <div className={`${pedidoEnviado ? 'pedidoEnviado' : 'none'} flexColumn contentCenter itemsCenter mt1rem`}>
              <img id="iconConfirma" src={iconeConfirma} alt="foto de ok" />
              <p>
                Pedido Confirmado!
                <br />
                Agora é só aguardar o seu pedido
              </p>
              <button className="btLaranja" type="button" onClick={handleClose}>
                Voltar para cardápio
              </button>
            </div> */}
            <div className={`${carinhoVazio ? 'semPedidos' : 'none'} flexColumn contentCenter itemsCenter mt1rem px3rem`}>
              <p>
                <span>Endereço de Entrega:</span>
                {' '}
                Av. Tancredo Neves, 2227, ed. Salvador Prime, sala 901:906; 917:920 - Caminho das Árvores, Salvador - BA, 41820-021
              </p>
              <img id="iconSemPedidos" src={iconeSemPedido} alt="foto de ok" />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
