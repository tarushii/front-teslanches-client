import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function useAuthProvider() {
  const [tokenPersistido, setTokenPersistido, removeTokenPersistido] = useLocalStorage('TOKEN', null);
  const [usuario, setUsuario, removeUsuario] = useLocalStorage('USUARIO', {});
  const [carrinhoLS, setCarrinhoLS, removeCarrinhoLS] = useLocalStorage('CARRINHO', []);

  const [user, setUser] = useState(usuario);
  const [token, setToken] = useState(tokenPersistido);

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

  function adicionarNoCarrinho(cart) {
    setCarrinhoLS(cart);
  }

  function removerDoCarrinho() {
    removeCarrinhoLS();
  }

  return {
    user,
    token,
    logar,
    deslogar,
    adicionarNoCarrinho,
    removerDoCarrinho,
    carrinhoLS
  };
}
