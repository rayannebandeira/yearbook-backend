export default function logger(req, res, next) {
  // Marca o início da requisição
  const inicio = Date.now();

  // Executa quando a resposta termina de ser enviada
  res.on('finish', () => {
    const duracao = Date.now() - inicio;

    console.log(
      `[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duracao} ms`
    );
  });

  // Continua para o próximo middleware
  next();
}