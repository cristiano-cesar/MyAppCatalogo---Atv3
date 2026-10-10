import { autenticar } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import { prisma } from "./prisma.js";
import {
  produtoSchema,
  atualizarProdutoSchema,
} from "./schemas/produtoSchema.js";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

// Verifica se a API está funcionando
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Lista todos os produtos
app.get("/api/produtos", async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: "asc" },
    });

    res.status(200).json(produtos);
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);
    res.status(500).json({
      erro: "Não foi possível consultar os produtos.",
    });
  }
});

// Consulta um produto pelo ID
app.get(
  "/api/produtos/:id",
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        erro: "O ID deve ser um número inteiro positivo.",
      });
      return;
    }

    try {
      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        res.status(404).json({
          erro: "Produto não encontrado.",
        });
        return;
      }

      res.status(200).json(produto);
    } catch (erro) {
      console.error("Erro ao consultar produto:", erro);
      res.status(500).json({
        erro: "Não foi possível consultar o produto.",
      });
    }
  }
);

// Cadastra um produto
app.post(
  "/api/produtos",
  autenticar,
  async (req: Request, res: Response) => {
    const resultado = produtoSchema.safeParse(req.body);

    if (!resultado.success) {
      res.status(400).json({
        erro: "Dados do produto inválidos.",
        detalhes: resultado.error.issues.map((item) => ({
          campo: item.path.join("."),
          mensagem: item.message,
        })),
      });
      return;
    }

    const dados = resultado.data;

    try {
      const produto = await prisma.produto.create({
        data: {
          nome: dados.nome.trim(),
          descricao: dados.descricao.trim(),
          preco: String(dados.preco),
          imagemUrl: dados.imagemUrl || null,
        },
      });

      res.status(201).json(produto);
    } catch (erro: any) {
      if (erro.code === "P2002") {
        res.status(409).json({
          erro: "Já existe um produto com esse nome.",
        });
        return;
      }

      console.error("Erro ao cadastrar produto:", erro);
      res.status(500).json({
        erro: "Não foi possível cadastrar o produto.",
      });
    }
  }
);

// Atualiza parcialmente um produto
app.put(
  "/api/produtos/:id",
  autenticar,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        erro: "O ID deve ser um número inteiro positivo.",
      });
      return;
    }

    const resultado = atualizarProdutoSchema.safeParse(req.body);

    if (!resultado.success) {
      res.status(400).json({
        erro: "Dados do produto inválidos.",
        detalhes: resultado.error.issues.map((item) => ({
          campo: item.path.join("."),
          mensagem: item.message,
        })),
      });
      return;
    }

    const dados = resultado.data;

    if (Object.keys(dados).length === 0) {
      res.status(400).json({
        erro: "Informe pelo menos um campo para atualizar.",
      });
      return;
    }

    try {
      const produto = await prisma.produto.update({
        where: { id },
        data: {
          ...(dados.nome !== undefined && {
            nome: dados.nome.trim(),
          }),
          ...(dados.descricao !== undefined && {
            descricao: dados.descricao.trim(),
          }),
          ...(dados.preco !== undefined && {
            preco: String(dados.preco),
          }),
          ...(dados.imagemUrl !== undefined && {
            imagemUrl: dados.imagemUrl || null,
          }),
        },
      });

      res.status(200).json(produto);
    } catch (erro: any) {
      if (erro.code === "P2025") {
        res.status(404).json({
          erro: "Produto não encontrado.",
        });
        return;
      }

      if (erro.code === "P2002") {
        res.status(409).json({
          erro: "Já existe outro produto com esse nome.",
        });
        return;
      }

      console.error("Erro ao atualizar produto:", erro);
      res.status(500).json({
        erro: "Não foi possível atualizar o produto.",
      });
    }
  }
);

// Exclui um produto
app.delete(
  "/api/produtos/:id",
  autenticar,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        erro: "O ID deve ser um número inteiro positivo.",
      });
      return;
    }

    try {
      await prisma.produto.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (erro: any) {
      if (erro.code === "P2025") {
        res.status(404).json({
          erro: "Produto não encontrado.",
        });
        return;
      }

      console.error("Erro ao excluir produto:", erro);
      res.status(500).json({
        erro: "Não foi possível excluir o produto.",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
