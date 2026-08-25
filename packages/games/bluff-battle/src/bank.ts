import type { BluffPrompt } from "./index.js";

/**
 * Built-in PT prompt bank — each entry pairs a funny fill-in prompt with the
 * canonical "true" answer the table must find (spec §14.5). Content packs can
 * replace this at runtime; the bank keeps the game playable out of the box.
 */
export const promptBank: BluffPrompt[] = [
  { id: "b001", prompt: "O motivo mais ridículo para chegar tarde", correctText: "Um ganso roubou-lhe as chaves" },
  { id: "b002", prompt: "A desculpa mais estranha num atestado médico", correctText: "Alergia a segundas-feiras" },
  { id: "b003", prompt: "O talento secreto mais inútil de um político", correctText: "Assobiar com os dedos do pé" },
  { id: "b004", prompt: "O nome mais improvável para um barco de pesca", correctText: "O Titanic II" },
  { id: "b005", prompt: "A pior coisa para dizer numa entrevista de emprego", correctText: "Trouxe o meu próprio cacifo" },
  { id: "b006", prompt: "O superpoder menos útil de sempre", correctText: "Voar só às segundas-feiras" },
  { id: "b007", prompt: "O prato mais arriscado de um buffet de hotel", correctText: "Sushi de atum com maionese" },
  { id: "b008", prompt: "A modalidade olímpica mais estranha já inventada", correctText: "Lançamento de móvel" },
  { id: "b009", prompt: "O pior nome possível para um cão de guarda", correctText: "Custódio, o Medroso" },
  { id: "b010", prompt: "A coisa mais estranha esquecida num táxi", correctText: "Um polvo vivo e bem-disposto" },
  { id: "b011", prompt: "O motivo mais bizarro para despedirem uma babá", correctText: "Ensinar a criança a latir" },
  { id: "b012", prompt: "O presente de casamento mais barato alguma vez registado", correctText: "Um saco de batatas" },
  { id: "b013", prompt: "A melhor desculpa para fugir de uma reunião", correctText: "O meu peixe precisa de mim" },
  { id: "b014", prompt: "O cheiro mais impossível de esconder num elevador", correctText: "Queijo Serra da Estrela" },
];
