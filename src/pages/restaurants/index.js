/* eslint-disable max-len */
/* eslint-disable consistent-return */
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
import CustomCard from '../../components/customCard';

import illustrationTop from '../../assets/illustration-top.svg';
import avatarPadrao from '../../assets/avatar-padrao.gif';
import logoRestaurante from '../../assets/logo-restaurantes.svg';
import DetalheProduto from '../order';
import Cart from '../cart';
import Address from '../address';

export default function restaurantes() {
  const { user, token, deslogar } = useAuth();
  const [lojas, setLojas] = useState([]);
  const [filtroLojas, setFiltroLojas] = useState([]);
  const [f5, setF5] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const customId = 'custom-id-yes';
  const history = useHistory();

  useEffect(() => {
    setF5(false);
    async function buscarRestaurantes() {
      try {
        const { dados, ok } = await get('/restaurantes', token);

        if (!ok) {
          toast.error(dados, { toastId: customId });
          return;
        }
        setLojas(dados);
      } catch (error) {
        toast.error(error.message, { toastId: customId });
      }
    }

    // const buscarUsuario = async () => {
    //   try {
    //     const { dados, ok } = await get('/usuario', token);

    //     if (!ok) {
    //       return toast.error(`erro${dados}`);
    //     }
    //     toast.success(dados);

    //     return setUsuario(dados);
    //   } catch (error) {
    //     return toast.error(error.message);
    //   }
    // };
    // buscarUsuario();
    buscarRestaurantes();
  }, [token, f5]);

  function toastWarn() {
    if (filtroLojas.length > 0) {
      toast.warn('Não foi encontrado nenhum restaurante com esse nome', { toastId: customId });
    }
  }

  const naoTemWarn = setTimeout(toastWarn, 500);

  function stopTimer() {
    clearTimeout(naoTemWarn);
    clearInterval(naoTemWarn);
  }

  function filtrado(loja) {
    if (!filtroLojas) return loja;
    if (filtroLojas.length > 0 && !loja.nome.includes(filtroLojas)) {
      // eslint-disable-next-line no-unused-expressions
      naoTemWarn;
    }
    if (filtroLojas && loja.nome.includes(filtroLojas)) {
      stopTimer();
      return loja;
    }
  }

  return (
    <div className="bodyRestaurantes">
      <div className="conteinerTopo contentCenter itemsCenter">
        <div className="flexRow contentBetween itemsCenter">
          <h1 className="nomeRestaurante">{ user.NomeUsuario }</h1>
          <button className="btLogout logout" type="button" onClick={deslogar}>Logout</button>
          <img id="logoRestaurante" src={logoRestaurante} alt="logo pag restaurante" />
        </div>
        <img className="vetorRestaurantes" src={illustrationTop} alt="vetor" />
      </div>
      <img
        src={usuario.imagem_restaurante
          ? usuario.imagem_restaurante
          : avatarPadrao}
        alt="avatarRestaurante"
        className="avatarRestaurante"
      />
      <div className="avatarRestaurante">
        {/* <UsuarioEditar {...usuario} recarregarPag={() => setF5(true)} /> */}
      </div>
      <div className={`${lojas.length === 0 ? 'none' : 'contemRestaurantes'} flexColumn contentCenter itemsCenter mt2rem`}>
        <div className="contemBotao flexRow itemsCenter">
          <input
            id="inputBusca"
            type="text"
            placeholder="Buscar"
            onChange={(e) => setFiltroLojas(e.target.value)}
          />
          {/* TODO - fazer um spread de restaurante + produto no comp DetalheProduto la na pagina do restaurante */}
          <DetalheProduto />
          <Cart />
          <Address />
        </div>
        <div className="conteinerCardapio flexRow gap2rem">
          { lojas.filter(filtrado).map((loja) => (
            <div className="provisorio" onClick={() => history.push(`/restaurantes/${loja.id}/perfil`)} aria-hidden="true">

              <CustomCard
                {...loja}
                recarregarPag={() => setF5(true)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={`${lojas.length === 0 ? 'addRestaurantes' : 'none'} flexColumn contentCenter itemsCenter`}>
        <span>
          No momento nenhum restaurante esta ativo.
          <br />
          Gostaria de jogar um joguinho?
        </span>
        <button className="btLaranja mt2rem" type="button">joguinho</button>
      </div>
    </div>
  );
}
