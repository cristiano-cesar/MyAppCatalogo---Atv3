
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const produtos = [
    {
      nome: "Notebook Lenovo ThinkPad E14",
      descricao: "Notebook para atividades profissionais, estudos e desenvolvimento de software.",
      preco: "4299.90",
    },
    {
      nome: "Mouse Logitech M170",
      descricao: "Mouse sem fio compacto para uso doméstico e profissional.",
      preco: "89.90",
    },
    {
      nome: "Teclado Logitech K120",
      descricao: "Teclado USB com layout ABNT2 para computadores.",
      preco: "79.90",
    },
    {
      nome: "Monitor Dell 24 polegadas",
      descricao: "Monitor para produtividade, programação e atividades de escritório.",
      preco: "899.90",
    },
    {
      nome: "SSD Kingston 1 TB",
      descricao: "Unidade de armazenamento SSD para ampliar o espaço e melhorar o desempenho do computador.",
      preco: "499.90",
    },
  ];

  for (const produto of produtos) {
    await prisma.produto.upsert({
      where: { nome: produto.nome },
      update: {},
      create: {
        ...produto,
        imagemUrl: null,
      },
    });
  }

  console.log("Seed executado com sucesso!");
}

main()
  .catch((erro) => {
    console.error("Erro ao executar o seed:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });