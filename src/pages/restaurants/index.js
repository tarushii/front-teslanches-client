/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import './styles.css';
import '../../styles/global.css';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import illustrationTop from '../../assets/illustration-top.svg';
// import CustomCard from '../../componentes/customCard';
import useAuth from '../../hooks/useAuth';
import { get } from '../../services/apiClient';

import avatarPadrao from '../../assets/avatar-padrao.gif';
import logoRestaurante from '../../assets/logo-restaurantes.svg';

export default function restaurantes() {
  const { user, token, deslogar } = useAuth();
  const [lojas, setLojas] = useState([]);
  const [f5, setF5] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const customId = 'custom-id-yes';

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

    const buscarUsuario = async () => {
      try {
        const { dados, ok } = await get('/usuario', token);

        if (!ok) {
          return toast.error(`erro${dados}`);
        }
        toast.success(dados);

        return setUsuario(dados);
      } catch (error) {
        return toast.error(error.message);
      }
    };

    buscarUsuario();
    buscarRestaurantes();
  }, [token, f5]);

  return (
    <div className="bodyRestaurantes">
      <div className="conteinerTopo contentCenter itemsCenter">
        <div className="flexRow contentBetween itemsCenter">
          <h1 className="nomeRestaurante">{ usuario.nome }</h1>
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

      <div className={`${lojas.length === 0 ? 'none' : 'contemRestaurantes'} flexColunm contentCenter itemsCenter mt2rem`}>
        <div className="contemBotao flexRow itemsCenter">
          <input type="text" placeholder="Buscar" />
        </div>

        <div className="conteinerCardapio flexRow gap2rem">
          { lojas.map((loja) => (
            <div className="flip-card" item key={loja.id}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  {/* <CustomCard
                    {...loja}
                    recarregarPag={() => setF5(true)}
                  /> */}
                  <div>card</div>
                </div>
                {/* <div className="flip-card-back">
                  <CustomModal {...produto} recarregarPag={() => setF5(true)} />
                  { ' ' }
                  <RestaurantesEditar {...produto} recarregarPag={() => setF5(true)} />
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${lojas.length === 0 ? 'addRestaurantes' : 'none'} flexColunm contentCenter itemsCenter`}>
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
