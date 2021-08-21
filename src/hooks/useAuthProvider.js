import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function useAuthProvider() {
  const [tokenPersistido, setTokenPersistido, removeTokenPersistido] = useLocalStorage('TOKEN', null);
  const [usuario, setUsuario, removeUsuario] = useLocalStorage('USUARIO', {});
  const [restauranteLS, setRestauranteLS, removeRestauranteLS] = useLocalStorage('RESTAURANTE', {});
  const [carrinhoLS, setCarrinhoLS, removeCarrinhoLS] = useLocalStorage('CARRINHO', []);

  const [user, setUser] = useState(usuario);
  const [token, setToken] = useState(tokenPersistido);
  const [rest, setRest] = useState(restauranteLS);
  const [cart, setCart] = useState(carrinhoLS);

  const logar = (usuario, token) => {
    setToken(token);
    setUser(usuario);
    setTokenPersistido(token);
    setUsuario(usuario);
  };

  const deslogar = () => {
    setToken(null);
    removeTokenPersistido();
    removeUsuario();
  };

  function adicionarNoCarrinho(carrinho) {
    setCarrinhoLS(carrinho);
  }

  function removerDoCarrinho() {
    removeCarrinhoLS();
  }

  return {
    user,
    token,
    logar,
    deslogar,
    setCarrinhoLS,
    removeCarrinhoLS,
    cart,
    setRestauranteLS,
    removeRestauranteLS,
    rest
  };
}
