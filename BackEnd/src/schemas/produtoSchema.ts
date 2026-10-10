
import { z } from "zod";

export const produtoSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  descricao: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),

  preco: z
    .number()
    .positive("O preço deve ser maior que zero."),

  imagemUrl: z
    .string()
    .min(1, "A URL da imagem não pode ser vazia.")
    .optional()
    .or(z.literal("")),
});

export const atualizarProdutoSchema =
  produtoSchema.partial();
