import { Router } from 'express';
import {
  listarMensagens,
  criarMensagem,
  deletarMensagem,
} from '../controllers/mensagensController.js';

const router = Router();

router.get('/', listarMensagens);
router.post('/', criarMensagem);
router.delete('/:id', deletarMensagem);

export default router;