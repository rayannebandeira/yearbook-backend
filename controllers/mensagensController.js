import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// 🎯 GET /mensagens — lista todas as mensagens com o autor embutido
export async function listarMensagens(req, res) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },  // mais recente primeiro
      include: {
        autor: {                        // traz dados do autor junto
          select: {
            nome: true,                 // nome do autor
            fotoUrl: true,              // foto do autor
          },
        },
      },
    });
    return res.json(mensagens); // retorna a lista com autor embutido
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// 🎯 POST /mensagens — cria uma nova mensagem
export async function criarMensagem(req, res) {
  try {
    // 💡 PROTEÇÃO: Se o body não existir ou vier vazio, já responde 400 sem deixar o Node quebrar
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ erro: "O campo 'texto' é obrigatório." });
    }

    const { texto, imagemUrl, autorId } = req.body;

    // Valide: se texto não existir, retorne 400
    if (!texto) {
      return res.status(400).json({ erro: "O campo 'texto' é obrigatório." });
    }

    // Crie com prisma.mensagem.create()
    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: autorId ? Number(autorId) : undefined, // Evita converter undefined para NaN
      },
    });

    return res.status(201).json(novaMensagem);

  } catch (erro) {
    console.error("Erro ao criar mensagem:", erro);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// 🎯 DELETE /mensagens/:id — deleta uma mensagem
// Siga o mesmo padrão do deletarAluno
export async function deletarMensagem(req, res) {
  const { id } = req.params;

  try {
    await prisma.mensagem.delete({
      where: {
        id: Number(id), // Convertendo o ID da URL para número
      },
    });

    // Sucesso: Status 204 sem body (conforme o padrão do deletarAluno)
    return res.status(204).end();
  } catch (error) {
    // Se o Prisma não achar o ID (erro P2025) ou der outro erro de não encontrado
    return res.status(404).json({
      erro: 'Mensagem não encontrada',
    });
  }
}