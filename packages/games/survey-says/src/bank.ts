/**
 * Survey Says content bank (spec §18) — perguntas populares em português.
 * Cada pergunta tem 4-6 respostas oficiais com pesos DESCENDENTES
 * (invariante garantido por teste: pesos[i] >= pesos[i+1]).
 */
export interface SurveyAnswer {
  text: string;
  weight: number;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  answers: SurveyAnswer[];
}

export const SURVEY_QUESTIONS: readonly SurveyQuestion[] = [
  {
    id: "manha",
    question: "O que as pessoas fazem logo de manhã?",
    answers: [
      { text: "Café", weight: 30 },
      { text: "Ver o telemóvel", weight: 25 },
      { text: "Duche", weight: 20 },
      { text: "Pequeno-almoço", weight: 15 },
      { text: "Escovar os dentes", weight: 10 },
    ],
  },
  {
    id: "medos",
    question: "Qual é o maior medo das pessoas?",
    answers: [
      { text: "Alturas", weight: 30 },
      { text: "Aranhas", weight: 25 },
      { text: "Falar em público", weight: 20 },
      { text: "Palhaços", weight: 15 },
      { text: "Escuridão", weight: 10 },
    ],
  },
  {
    id: "praia",
    question: "O que se leva para a praia?",
    answers: [
      { text: "Toalha", weight: 30 },
      { text: "Protetor solar", weight: 25 },
      { text: "Chapéu", weight: 20 },
      { text: "Sanduíche", weight: 15 },
      { text: "Bola", weight: 10 },
    ],
  },
  {
    id: "estimacao",
    question: "Um animal que as pessoas têm em casa",
    answers: [
      { text: "Cão", weight: 35 },
      { text: "Gato", weight: 30 },
      { text: "Peixe", weight: 15 },
      { text: "Papagaio", weight: 10 },
      { text: "Hamster", weight: 10 },
    ],
  },
  {
    id: "fds",
    question: "O que se faz ao fim de semana?",
    answers: [
      { text: "Dormir até tarde", weight: 30 },
      { text: "Passear", weight: 20 },
      { text: "Ver séries", weight: 20 },
      { text: "Limpar a casa", weight: 15 },
      { text: "Almoçar em família", weight: 15 },
    ],
  },
  {
    id: "fruta",
    question: "Uma fruta amarela",
    answers: [
      { text: "Banana", weight: 40 },
      { text: "Ananás", weight: 25 },
      { text: "Manga", weight: 20 },
      { text: "Melão", weight: 15 },
    ],
  },
  {
    id: "dinheiro",
    question: "Onde as pessoas guardam dinheiro extra?",
    answers: [
      { text: "Banco", weight: 30 },
      { text: "Cofre", weight: 25 },
      { text: "Debaixo do colchão", weight: 20 },
      { text: "Numa meia", weight: 15 },
      { text: "Frasco de vidro", weight: 10 },
    ],
  },
  {
    id: "perigoso",
    question: "Um trabalho perigoso",
    answers: [
      { text: "Bombeiro", weight: 30 },
      { text: "Polícia", weight: 25 },
      { text: "Eletricista", weight: 20 },
      { text: "Mineiro", weight: 15 },
      { text: "Pescador", weight: 10 },
    ],
  },
  {
    id: "escola",
    question: "O que as crianças levam para a escola?",
    answers: [
      { text: "Mochila", weight: 30 },
      { text: "Lanche", weight: 25 },
      { text: "Livros", weight: 20 },
      { text: "Lápis", weight: 15 },
      { text: "Estojo", weight: 10 },
    ],
  },
  {
    id: "preso",
    question: "Um sítio onde se fica preso sem querer",
    answers: [
      { text: "Elevador", weight: 30 },
      { text: "Trânsito", weight: 25 },
      { text: "Semáforo", weight: 20 },
      { text: "Fila de espera", weight: 15 },
      { text: "Maré alta", weight: 10 },
    ],
  },
  {
    id: "esplanada",
    question: "O que se pede numa esplanada?",
    answers: [
      { text: "Café", weight: 35 },
      { text: "Imperial", weight: 30 },
      { text: "Sumo natural", weight: 15 },
      { text: "Água", weight: 10 },
      { text: "Gin tónico", weight: 10 },
    ],
  },
  {
    id: "viagem",
    question: "O que estraga uma viagem?",
    answers: [
      { text: "Atraso de voo", weight: 30 },
      { text: "Bagagem perdida", weight: 25 },
      { text: "Companhia chata", weight: 20 },
      { text: "Enjoo", weight: 15 },
      { text: "Insolação", weight: 10 },
    ],
  },
] as const;

export function questionById(id: string): SurveyQuestion | undefined {
  return SURVEY_QUESTIONS.find((q) => q.id === id);
}
