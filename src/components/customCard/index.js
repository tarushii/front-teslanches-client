/* eslint-disable camelcase */
import './styles.css';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import precoConvertido from '../../formatting/currency';

export default function CustomCard({
  id,
  nome,
  preco,
  descricao,
  quantidade,
  valor_minimo_pedido,
  imagem_restaurante: imagemRestaurante,
  imagem,
}) {
  return (

    <card className="card flexRow gap1rem contentBetween itemsCenter posRelative">
      <div className="flexColumn gap2rem cardConteudo">
        <cardcontent className="flexColunm itemsStart ml2rem gap2rem">
          <Typography component="h5" variant="h5">
            <h1>{nome}</h1>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <p className="campoDescricao">{ descricao }</p>
            <p className="campoQuantidade">{quantidade && `${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}` }</p>

          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <div className="valorBox">
              <span className="campoPrecoPadrao">
                {precoConvertido(valor_minimo_pedido)}
              </span>
              <span className="campoPrecoCart">
                {precoConvertido(preco)}
              </span>
            </div>
          </Typography>
        </cardcontent>
      </div>
      <div className="flexRow mr1rem">
        <img className="imgCard" src={`${imagemRestaurante}`} alt={`foto de ${nome}`} />
        <img className="imgCardCart" src={`${imagem}`} alt={`foto de ${nome}`} />
      </div>

    </card>
  );
}
