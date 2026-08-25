/**
 * Spy Room content bank (spec §14.12) — 12 locais em português, 3 papéis cada.
 * O rng escolhe 1 local; os não-spies recebem papéis deste local e o spy
 * tenta adivinhar apenas o LOCAL (nunca o papel).
 */
export interface SpyLocation {
  id: string;
  name: string;
  roles: [string, string, string];
}

export const SPY_LOCATIONS: readonly SpyLocation[] = [
  { id: "praia", name: "Praia", roles: ["Salva-vidas", "Vendedora de gelados", "Turista"] },
  { id: "hospital", name: "Hospital", roles: ["Cirurgião", "Enfermeiro", "Paciente"] },
  { id: "navio-pirata", name: "Navio Pirata", roles: ["Capitão", "Grumete", "Cozinheiro de bordo"] },
  { id: "escola", name: "Escola", roles: ["Professor de matemática", "Zelador", "Aluno novo"] },
  { id: "supermercado", name: "Supermercado", roles: ["Repositor", "Caixeira", "Cliente com cupões"] },
  { id: "aeroporto", name: "Aeroporto", roles: ["Piloto", "Controladora de voo", "Passageira perdida"] },
  { id: "cinema", name: "Cinema", roles: ["Bilheteira", "Projecionista", "Espectador com pipocas"] },
  { id: "restaurante-chines", name: "Restaurante Chinês", roles: ["Chef de wok", "Empregado de mesa", "Crítico gastronómico"] },
  { id: "estacao-comboios", name: "Estação de Comboios", roles: ["Revisor", "Ferroviário", "Viajante sem bilhete"] },
  { id: "circo", name: "Circo", roles: ["Malabarista", "Domador de leões", "Palhaço triste"] },
  { id: "museu", name: "Museu", roles: ["Guia", "Vigilante de sala", "Restauradora de arte"] },
  { id: "estadio", name: "Estádio de Futebol", roles: ["Guarda-redes", "Árbitro", "Adepto da bancada norte"] },
] as const;

export function locationById(id: string): SpyLocation | undefined {
  return SPY_LOCATIONS.find((l) => l.id === id);
}
