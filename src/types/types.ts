export interface TilesRow {
  id: number;
  tiles: LetterTile[];
  isCompleted: boolean;
}

export interface LetterTile {
  id: string;
  value: string;
  status: 'exists' | 'correct' | 'wrong' | 'idle';
}
