const BASE_URL = 'http://localhost:8001';

async function postNaoAutenticado(point, data) {
  const resposta = await fetch(BASE_URL + point, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  });

  const dados = await resposta.json();

  return { dados, ok: resposta.ok };
}

async function postAutenticado(point, data, token) {
  const resposta = await fetch(BASE_URL + point, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
      tokenUsuario: `${token}`
    }
  });

  const dados = await resposta.json();

  return { dados, ok: resposta.ok };
}

async function get(point, token) {
  const resposta = await fetch(BASE_URL + point, {
    headers: {
      tokenUsuario: `${token}`
    },
  });

  const dados = await resposta.json();

  return { dados, ok: resposta.ok };
}

async function put(point, data, token) {
  const resposta = await fetch(BASE_URL + point, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
      tokenUsuario: `${token}`
    }
  });

  const dados = await resposta.json();

  return { dados, ok: resposta.ok };
}

async function del(point, token) {
  const resposta = await fetch(BASE_URL + point, {
    method: 'DELETE',
    headers: {
      tokenUsuario: `${token}`
    },
  });
  const dados = await resposta.json();

  return { dados, ok: resposta.ok };
}

export {
  postNaoAutenticado, postAutenticado, get, put, del
};
