const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configurado para aceitar frontend da Vercel
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions));

// Banco de dados fictício
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

// GET: listar todas as notícias
app.get("/noticias", (req, res) => {
  res.json({
    mensagem: "Notícias carregadas",
    total: noticias.length,
    noticias: noticias
  });
});

// GET: notícia por ID
app.get("/noticias/:id", (req, res) => {
  const noticia = noticias.find(n => n.id == req.params.id);
  if (!noticia) {
    return res.status(404).json({ erro: "Notícia não encontrada" });
  }
  res.json(noticia);
});

// POST: criar notícia
app.post("/noticias", (req, res) => {
  const { titulo, descricao, categoria } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ erro: "Título e descrição obrigatórios" });
  }

  const novaNoticia = {
    id: Math.max(...noticias.map(n => n.id)) + 1,
    titulo,
    descricao,
    categoria: categoria || "Geral",
    data: new Date().toISOString().split('T')[0]
  };

  noticias.push(novaNoticia);
  res.status(201).json({ mensagem: "Notícia criada", noticia: novaNoticia });
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "Backend de Notícias rodando com CI/CD",
    versao: "1.0.1",
    cors_ativo: true,
    frontend_integrado: true
  });
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`CORS habilitado para: ${corsOptions.origin}`);
});