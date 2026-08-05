import prisma from '../prisma/client.js';

const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
};

// GET /alunos
export async function listarAlunos(req, res, next) {
  try {
    const alunos = await prisma.aluno.findMany({ select: selectSemSenha });
    res.json(alunos);
  } catch (erro) {
    next(erro);
  }
}

// GET /alunos/:id
export async function buscarAluno(req, res, next) {
  try {
    const numericId = Number(req.params.id);

    if (isNaN(numericId)) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: numericId },
      select: selectSemSenha,
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    return res.json(aluno);
  } catch (erro) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}

// POST /alunos
export async function criarAluno(req, res, next) {
  try {
    const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

    const alunoCriado = await prisma.aluno.create({
      data: { nome, email, senhaHash, cidade, frase, planosFuturos },
      select: selectSemSenha,
    });

    return res.status(201).json(alunoCriado);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado no sistema.' });
    }
    next(error);
  }
}

// PUT /alunos/:id
export async function atualizarAluno(req, res, next) {
  const { id } = req.params;
  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: req.body,
      select: selectSemSenha,
    });
    return res.json(alunoAtualizado);
  } catch (error) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}

// DELETE /alunos/:id
export async function deletarAluno(req, res, next) {
  const numericId = Number(req.params.id);

  if (isNaN(numericId)) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  try {
    const alunoExistente = await prisma.aluno.findUnique({
      where: { id: numericId },
    });

    if (!alunoExistente) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    await prisma.aluno.delete({ where: { id: numericId } });
    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}