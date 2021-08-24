/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import './styles.css';
import '../../styles/global.css';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { get } from '../../services/apiClient';
import Order from '../order';
import Cart from '../cart';

import illustrationTop from '../../assets/illustration-top.svg';
import CustomCard from '../../components/customCard';
import Diversos from '../../assets/bg-Diversos.png';
import Pizzaria from '../../assets/bg-Pizzaria.png';
import Massas from '../../assets/bg-Massas.png';
import Arabe from '../../assets/bg-Arabe.png';
import Carnes from '../../assets/bg-Carnes.png';
import Chinesa from '../../assets/bg-Chinesa.png';
import Italiana from '../../assets/bg-Italiana.png';
import Japonesa from '../../assets/bg-Japonesa.png';
import Mexicano from '../../assets/bg-Mexicano.png';
import Brasileira from '../../assets/bg-Brasileira.png';
import Lanches from '../../assets/bg-Lanches.png';
import iconMoney from '../../assets/coinIcon.svg';
import iconTime from '../../assets/timeIcon.svg';
import emptyStore from '../../assets/emptyStore.svg';

export default function produtos() {
  const {
    user, token, deslogar, setCarrinhoLS, setRestauranteLS, cart
  } = useAuth();
  const [prod, setProd] = useState([]);
  const [f5, setF5] = useState(false);
  const [restaurante, setRestaurante] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const customId = 'custom-id-yes';
  const { id } = useParams();

  useEffect(() => {
    setF5(false);
    async function buscarProdutos() {
      try {
        const { dados, ok } = await get(`/restaurate/${id}/perfil`, token);

        if (!ok) {
          toast.error(dados, { toastId: customId });
          return;
        }
        setProd(dados);
      } catch (error) {
        toast.error(error.message, { toastId: customId });
      }
    }

    const buscarUsuario = async () => {
      try {
        const { dados, ok } = await get(`/restaurante/${id}`, token);

        if (!ok) {
          return toast.error(`erro${dados}`);
        }
        toast.success(dados);

        setRestauranteLS(dados);
        return setRestaurante(dados);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    buscarUsuario();
    buscarProdutos();
  }, [token, f5]);

  function handleCarrinho(produto) {
    const novoCarrinho = [...carrinho];
    const temNoCarrinho = novoCarrinho.find((item) => item.nome === produto.nome);

    setSubTotal(subTotal + produto.preco * produto.quantidade);

    if (temNoCarrinho) {
      temNoCarrinho.quantidade = produto.quantidade;
      if (produto.quantidade === 0) {
        setCarrinho(novoCarrinho.filter((item) => item.nome !== produto.nome));
        return;
      }
      setCarrinho(novoCarrinho);
      return;
    }
    setCarrinho([...novoCarrinho, {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
      valorTotal: (produto.quantidade * produto.preco),
      imagemProduto: produto.imagemProduto,
    }]);
    setCarrinhoLS(novoCarrinho);
  }
  const categoriaStyle = () => {
    const categoria = restaurante.categoria_id;
    switch (categoria) {
      default:
        return { backgroundImage: `url(${Pizzaria})` };
      case 1:
        return { backgroundImage: `url(${Diversos})` };
      case 2:
        return { backgroundImage: `url(${Lanches})` };
      case 3:
        return { backgroundImage: `url(${Carnes})` };
      case 4:
        return { backgroundImage: `url(${Massas})` };
      case 5:
        return { backgroundImage: `url(${Pizzaria})` };
      case 6:
        return { backgroundImage: `url(${Japonesa})` };
      case 7:
        return { backgroundImage: `url(${Chinesa})` };
      case 8:
        return { backgroundImage: `url(${Mexicano})` };
      case 9:
        return { backgroundImage: `url(${Brasileira})` };
      case 10:
        return { backgroundImage: `url(${Italiana})` };
      case 11:
        return { backgroundImage: `url(${Arabe})` };
    }
  };

  return (
    <div className="bodyProdutos">
      <div style={categoriaStyle()} className="conteinerTopo contentCenter itemsCenter">
        <div className="flexRow contentBetween itemsCenter">
          <h1 className="nomeRestaurante">{ restaurante.nome }</h1>
          <button className="btLogout logout" type="button" onClick={deslogar}>Logout</button>
        </div>
      </div>
      <img className="vetorProdutos" src={illustrationTop} alt="vetor" />
      <img src={restaurante.imagem_restaurante} alt="avatarRestaurante" className="avatarRestaurante" />
      <div className="contemBotao flexRow itemsCenter botaoCarrinho">
        {carrinho.length > 0 ? (
          <Cart
            carrinho={carrinho}
            subTotal={subTotal}
            {...restaurante}
            recarregarPag={() => setF5(true)}
            emptyCart={() => setCarrinho([])}
            nomeAbrirCart="Revisar pedido"
          />
        ) : ('')}
      </div>
      <div className="icons">
        <div className="icons1">
          <h3>
            <img src={iconMoney} alt="Icone de dinheiro" />

            <span>Pedido Minimo: </span>
            $
            {restaurante.valor_minimo_pedido / 100}
          </h3>
        </div>
        <div>
          <h3>
            <img src={iconTime} alt="Icone de tempo" />

            <span>Tempo de Entrega: </span>

            {restaurante.tempo_entrega_minutos}
            {' '}
            minutos, aproximadamente
          </h3>
        </div>
      </div>
      <div className={`${prod.length === 0 ? 'none' : 'contemProdutos'} flexColunm contentCenter itemsCenter mt2rem`}>

        <div className="conteinerCardapio2 flexRow gap2rem">
          { prod.map((produto) => (
            <div className="boxCardRestauranteProfile" aria-hidden="true">
              <CustomCard
                {...produto}
                recarregarPag={() => setF5(true)}
              />
              <Order
                {...restaurante}
                {...produto}
                carrinho={carrinho}
                subTotal={subTotal}
                handleCarrinho={handleCarrinho}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={`${prod.length === 0 ? 'addProdutos' : 'none'} flexColunm contentCenter itemsCenter`}>
        <div className="retangulo">
          <img src={emptyStore} alt="Loja sem produtos disponiveis" />
          <span> Desculpe, estamos sem produtos ativos </span>
        </div>
      </div>
    </div>
  );
}
