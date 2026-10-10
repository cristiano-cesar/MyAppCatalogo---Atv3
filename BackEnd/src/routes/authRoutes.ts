
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import { prisma } from "../prisma.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { autenticar } from "../middleware/authMiddleware.js";

const router = Router();

function gerarToken(userId: number): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const resultado = registerSchema.safeParse(req.body);

  if (!resultado.success) {
    res.status(400).json({
      erro: "Dados de cadastro inválidos.",
      detalhes: resultado.error.issues.map((item) => ({
        campo: item.path.join("."),
        mensagem: item.message,
      })),
    });
    return;
  }

  const { nome, email, senha } = resultado.data;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.user.create({
      data: {
        nome,
        email: email.toLowerCase(),
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    const token = gerarToken(usuario.id);

    res.status(201).json({ usuario, token });
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2002"
    ) {
      res.status(409).json({
        erro: "Já existe um usuário cadastrado com esse e-mail.",
      });
      return;
    }

    console.error("Erro ao registrar usuário:", erro);
    res.status(500).json({
      erro: "Não foi possível registrar o usuário.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const resultado = loginSchema.safeParse(req.body);

  if (!resultado.success) {
    res.status(400).json({
      erro: "Dados de login inválidos.",
      detalhes: resultado.error.issues.map((item) => ({
        campo: item.path.join("."),
        mensagem: item.message,
      })),
    });
    return;
  }

  const { email, senha } = resultado.data;

  try {
    const usuario = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
      return;
    }

    const token = gerarToken(usuario.id);

    res.status(200).json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        criadoEm: usuario.criadoEm,
      },
      token,
    });
  } catch (erro) {
    console.error("Erro ao realizar login:", erro);
    res.status(500).json({
      erro: "Não foi possível realizar o login.",
    });
  }
});

// GET /api/auth/me
router.get("/me", autenticar, async (_req, res) => {
  try {
    const userId = res.locals.userId as number;

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    if (!usuario) {
      res.status(404).json({
        erro: "Usuário não encontrado.",
      });
      return;
    }

    res.status(200).json({ usuario });
  } catch (erro) {
    console.error("Erro ao consultar usuário autenticado:", erro);
    res.status(500).json({
      erro: "Não foi possível consultar o usuário.",
    });
  }
});

export default router;
