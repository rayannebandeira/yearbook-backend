import prisma from '../prisma/client.js';

// GET /mensagens
export async function listarMensagens(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        autor: {
          select: {
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });
    return res.json(mensagens);
  } catch (erro) {
    next(erro);
  }
}

// POST /mensagens
export async function criarMensagem(req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ erro: "O campo 'texto' é obrigatório." });
    }

    const { texto, imagemUrl, autorId } = req.body;

    if (!texto || typeof texto !== 'string' || texto.trim() === '') {
      return res.status(400).json({ erro: "O campo 'texto' é obrigatório." });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto: texto.trim(),
        imagemUrl,
        autorId: autorId ? Number(autorId) : undefined,
      },
    });

    return res.status(201).json(novaMensagem);
  } catch (erro) {
    next(erro);
  }
}

// DELETE /mensagens/:id
export async function deletarMensagem(req, res, next) {
  const numericId = Number(req.params.id);

  if (isNaN(numericId)) {
    return res.status(404).json({ erro: 'Mensagem não encontrada' });
  }

  try {
    const mensagemExistente = await prisma.mensagem.findUnique({
      where: { id: numericId },
    });

    if (!mensagemExistente) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    await prisma.mensagem.delete({
      where: { id: numericId },
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ erro: 'Mensagem não encontrada' });
  }
}