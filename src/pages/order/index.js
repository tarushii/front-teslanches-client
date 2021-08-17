/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useStyles from './styles';
import './styles.css';

export default function DetalheProduto() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const customId = 'custom-id-yes';

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <div onClick={(e) => stop(e)} className={classes.container}>
      <button
        type="button"
        className="btLaranja mt2rem"
        onClick={handleClickOpen}
      >
        card do produto
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className="flexColumn">
          <div className="BodyDetalheProduto flexRow gap3rem px2rem">
            <div className="fotoProduto posRelative">

              <img src={fotoProduto} alt="foto do produto" className="fotoProduto" />

              <img className="avatarRestaurante" src={avatarRestaurante} alt="avatar do restaurante" />

            </div>
            <div>
              <h1>Nome do produto</h1>
              <div className="flexRow">
                <span>Pedido minimo do rest</span>
                <span> tempo de entrega</span>
              </div>
              <form>
                <div className="flexRow">
                  <p>descricao</p>
                  <span className="preco">$99</span>
                </div>
                <div className="flexRow">
                  click de -/+
                  botao de submit
                </div>
                <button type="submit">ir para cart</button>
              </form>
            </div>
          </div>
        </div>
        <DialogActions className={classes.botoes}>
          <button className="btTransparente" type="button" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btLaranja" type="submit" onClick={handleSubmit(onSubmit)}>
            Salvar alterações
          </button>
        </DialogActions>
      </Dialog>
    </div>

  );
}
