import type { MajorityQuestion } from "./index.js";

/**
 * Built-in PT question bank — each entry asks the table to predict which
 * option the MAJORITY will pick (spec §14.2). Options are always labelled
 * a–d; content packs can replace this at runtime. The bank keeps the game
 * playable out of the box (≥ max rounds = 15).
 */
export const questionBank: MajorityQuestion[] = [
  { id: "mv01", question: "Que pizza encomendaria a maioria?", options: ["Margherita clássica", "Pepperoni picante", "Quatro queijos", "Com ananás, claro"] },
  { id: "mv02", question: "Que estação do ano a maioria escolheria?", options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { id: "mv03", question: "Que superpoder a maioria preferiria?", options: ["Voar", "Invisibilidade", "Parar o tempo", "Ler mentes"] },
  { id: "mv04", question: "Onde passaria a maioria as férias ideais?", options: ["Praia", "Montanha", "Cidade europeia", "Cruzeiro"] },
  { id: "mv05", question: "Que pequeno-almoço a maioria pediria hoje?", options: ["Café simples", "Torradas", "Panquecas", "Fruta e iogurte"] },
  { id: "mv06", question: "Que animal de estimação a maioria adoptaria?", options: ["Cão", "Gato", "Peixes", "Nenhum"] },
  { id: "mv07", question: "Que género de filme a maioria escolheria esta noite?", options: ["Comédia", "Accão", "Terror", "Documentário"] },
  { id: "mv08", question: "Que talento a maioria gostaria de ter amanhã?", options: ["Falar todos os idiomas", "Tocar guitarra", "Cozinhar como chef", "Cantar afinado"] },
  { id: "mv09", question: "Que bebida a maioria levaria a um piquenique?", options: ["Água fresca", "Sumo natural", "Refrigerante", "Chá gelado"] },
  { id: "mv10", question: "Que meio de transporte a maioria usaria numa cidade desconhecida?", options: ["A pé", "Bicicleta", "Metro", "Táxi/Uber"] },
  { id: "mv11", question: "Que sobremesa a maioria devoraria primeiro?", options: ["Bolo de chocolate", "Gelado", "Arroz doce", "Pastel de nata"] },
  { id: "mv12", question: "Que programa de TV a maioria maratonaria?", options: ["Série policial", "Reality show", "Sitcom clássica", "K-drama"] },
  { id: "mv13", question: "Que hora a maioria escolheria para acordar sem alarmes?", options: ["6h madrugador", "8h equilibrado", "10h preguiçoso", "Ao meio-dia"] },
  { id: "mv14", question: "Que jogo de mesa a maioria escolheria para a família?", options: ["Cartas", "Pictionary", "Xadrez", "Jogo de quiz"] },
  { id: "mv15", question: "Que presente a maioria prefere receber?", options: ["Dinheiro", "Experiência (viagem/show)", "Roupa", "Gadget tecnológico"] },
  { id: "mv16", question: "Que chávena a maioria encheria num buffet de sopas?", options: ["Caldo verde", "Canja de galinha", "Sopa de legumes", "Creme de abóbora"] },
];
