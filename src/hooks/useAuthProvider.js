import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function useAuthProvider() {
  const [tokenPersistido, setTokenPersistido, removeTokenPersistido] = useLocalStorage('TOKEN', null);
  const [usuario, setUsuario, removeUsuario] = useLocalStorage('USUARIO', {});
  const [restauranteLS, setRestauranteLS, removeRestauranteLS] = useLocalStorage('RESTAURANTE', {});
  const [carrinhoLS, setCarrinhoLS, removeCarrinhoLS] = useLocalStorage('CARRINHO', []);
  const [subTotalLS, setSubTotalLS, removeSubTotalLS] = useLocalStorage('SUBTOTAL', []);

  const [user, setUser] = useState(usuario);
  const [token, setToken] = useState(tokenPersistido);
  const [rest, setRest] = useState(restauranteLS);
  const [cart, setCart] = useState(carrinhoLS);
  const [sub, setSub] = useState(subTotalLS);

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

  function adicionarNoCarrinhoLS(carrinho) {
    setCarrinhoLS(carrinho);
  }
  function adicionarNoSubTotalLS(subTotal) {
    setSubTotalLS(subTotal);
  }

  function removerDoCarrinhoLS() {
    removeCarrinhoLS();
    removeSubTotalLS();
  }

  return {
    user,
    rest,
    token,
    logar,
    deslogar,
    setRestauranteLS,
    removeRestauranteLS,
    adicionarNoCarrinhoLS,
    adicionarNoSubTotalLS,
    removerDoCarrinhoLS,
    cart,
    sub,
  };
}
