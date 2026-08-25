import type { QuizQuestion } from "./index.js";

/**
 * Built-in PT question bank. Content packs replace/extend this at runtime
 * (etapa 15); the bank keeps the game playable out of the box, offline.
 */
export const questionBank: QuizQuestion[] = [
  { id: "q001", category: "general", text: "Qual é a capital de Portugal?", choices: ["Porto", "Lisboa", "Braga", "Faro"], correctIndex: 1 },
  { id: "q002", category: "general", text: "Quantos lados tem um hexágono?", choices: ["5", "6", "7", "8"], correctIndex: 1 },
  { id: "q003", category: "general", text: "Qual é o maior oceano do mundo?", choices: ["Atlântico", "Índico", "Pacífico", "Ártico"], correctIndex: 2 },
  { id: "q004", category: "general", text: "Que animal é o símbolo do WWF?", choices: ["Tigre", "Panda", "Águia", "Golfinho"], correctIndex: 1 },
  { id: "q005", category: "general", text: "Quantas cores tem o arco-íris?", choices: ["5", "6", "7", "8"], correctIndex: 2 },
  { id: "q006", category: "general", text: "Qual é o rio mais longo do mundo?", choices: ["Nilo", "Amazonas", "Yangtzé", "Mississippi"], correctIndex: 1 },
  { id: "q007", category: "general", text: "Em que continente fica o Egito?", choices: ["Ásia", "Europa", "África", "Oceania"], correctIndex: 2 },
  { id: "q008", category: "general", text: "Quantos minutos tem uma hora e meia?", choices: ["80", "90", "100", "120"], correctIndex: 1 },
  { id: "q009", category: "tech", text: "O que significa 'HTTP'?", choices: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transport Program", "Home Tool Transfer Protocol"], correctIndex: 0 },
  { id: "q010", category: "tech", text: "Quem criou a World Wide Web?", choices: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Linus Torvalds"], correctIndex: 2 },
  { id: "q011", category: "tech", text: "Qual linguagem corre nativamente no navegador?", choices: ["Python", "JavaScript", "Java", "C#"], correctIndex: 1 },
  { id: "q012", category: "tech", text: "O que é um 'byte'?", choices: ["4 bits", "8 bits", "16 bits", "1024 bits"], correctIndex: 1 },
  { id: "q013", category: "tech", text: "Qual destes é um sistema operativo?", choices: ["Firefox", "Linux", "Photoshop", "Excel"], correctIndex: 1 },
  { id: "q014", category: "tech", text: "O que significa 'Wi-Fi' na prática?", choices: ["Rede sem fios", "Cabo de rede", "Tipo de modem", "Empresa de telecomunicações"], correctIndex: 0 },
  { id: "q015", category: "tech", text: "Qual protocolo resolve nomes em endereços IP?", choices: ["FTP", "SMTP", "DNS", "SSH"], correctIndex: 2 },
  { id: "q016", category: "tech", text: "Quantos bytes tem um kilobyte (padrão SI)?", choices: ["1000", "1024", "512", "2048"], correctIndex: 0 },
  { id: "q017", category: "movies", text: "Em 'Star Wars', quem é o pai de Luke Skywalker?", choices: ["Obi-Wan", "Darth Vader", "Yoda", "Imperador Palpatine"], correctIndex: 1 },
  { id: "q018", category: "movies", text: "Que filme ganhou o primeiro Óscar de Melhor Filme?", choices: ["Wings", "Titanic", "Casablanca", "Gone with the Wind"], correctIndex: 0 },
  { id: "q019", category: "movies", text: "Quem realizou 'Jurassic Park'?", choices: ["James Cameron", "Steven Spielberg", "Ridley Scott", "George Lucas"], correctIndex: 1 },
  { id: "q020", category: "movies", text: "Em 'Toy Story', qual é o nome do vaqueiro?", choices: ["Buzz", "Woody", "Jessie", "Rex"], correctIndex: 1 },
  { id: "q021", category: "movies", text: "Qual é o filme animado com a família Madrigal?", choices: ["Encanto", "Coco", "Vivo", "Luca"], correctIndex: 0 },
  { id: "q022", category: "movies", text: "'Matrix' foi lançado em que ano?", choices: ["1997", "1999", "2001", "2003"], correctIndex: 1 },
];
