
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const autenticar: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      erro: "Token de autenticação não informado.",
    });
    return;
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET não configurado.");
    res.status(500).json({
      erro: "Erro na configuração da autenticação.",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "number"
    ) {
      res.status(401).json({
        erro: "Token inválido.",
      });
      return;
    }

    res.locals.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({
      erro: "Token inválido ou expirado.",
    });
  }
};
