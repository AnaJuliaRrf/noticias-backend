const express = require("express");
const cors = require("cors");
const app = express();

// Define a porta da aplicação (Prioridade para o ambiente/Render, senão 5000)
const PORT = process.env.PORT || 5000;

// Middleware para ler JSON
app.use(express.json());

// CONFIGURAÇÃO DE CORS
// IMPORTANTE: Substitua as URLs abaixo pelas suas URLs REAIS do projeto
const corsOptions = {
  origin: [
    "https://noticias-frontend-six.vercel.app/", // URL do seu front na Vercel
    "https://special-fortnight-7vw5pwqv7pg4c4ww-5000.app.github.dev/" // URL do seu front no Codespaces
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}; 
app.use(cors(corsOptions));

// Banco de dados fictício (Mantido do seu código original)
let noticias = [
  {
    id: 1,
    titulo: "CI/CD revoluciona o desenvolvimento",
    descricao: "Saiba como automação melhora a produtividade",
    categoria: "Tecnologia",
    data: "2024-01-15"
  },
  {
    id: 2,
    titulo: "Render lança novos recursos gratuitos",
    descricao: "Plano free agora inclui mais memória",
    categoria: "Plataformas",
    data: "2024-01-14"
  }
];

// --- ROTAS OBRIGATÓRIAS (Parte 2.2) ---

// Rota principal (/)
app.get("/", (req, res) => {
  res.json({
    message: "Api em execucao no container docker..."
  });
});

// Rota v1 (/v1)
app.get("/v1", (req, res) => {
  const datahora = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo"
  });

  res.json({
    message: "Api v1 respondendo no container docker...",
    chamada_em: datahora
  });
});

// --- SUAS ROTAS DE NOTÍCIAS (Mantidas) ---

app.get("/noticias", (req, res) => {
  res.json({
    mensagem: "Notícias carregadas",
    total: noticias.length,
    noticias: noticias
  });
});

app.get("/noticias/:id", (req, res) => {
  const noticia = noticias.find(n => n.id == req.params.id);
  if (!noticia) {
    return res.status(404).json({ erro: "Notícia não encontrada" });
  }
  res.json(noticia);
});

app.post("/noticias", (req, res) => {
  const { titulo, descricao, categoria } = req.body;
  if (!titulo || !descricao) {
    return res.status(400).json({ erro: "Título e descrição obrigatórios" });
  }

  const novaNoticia = {
    id: noticias.length > 0 ? Math.max(...noticias.map(n => n.id)) + 1 : 1,
    titulo,
    descricao,
    categoria: categoria || "Geral",
    data: new Date().toISOString().split('T')[0]
  };

  noticias.push(novaNoticia);
  res.status(201).json({ mensagem: "Notícia criada", noticia: novaNoticia });
});

app.delete("/noticias/:id", (req, res) => {
  const { id } = req.params;
  const index = noticias.findIndex(n => n.id == id);

  if (index === -1) {
    return res.status(404).json({ erro: "Notícia não encontrada para exclusão" });
  }

  const noticiaRemovida = noticias.splice(index, 1);
  res.json({
    mensagem: "Notícia removida com sucesso",
    noticia: noticiaRemovida[0]
  });
});

// INICIALIZAÇÃO
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});