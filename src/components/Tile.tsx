import { LetterTile } from '../types/types';

export default function Tile({
  tile,
  active,
}: {
  tile: LetterTile;
  active: boolean;
}) {
  let bgColor = '#000';
  if (active) {
    switch (tile.status) {
      case 'correct':
        bgColor = '#538d4e';
        break;
      case 'exists':
        bgColor = '#b59f3b';
        break;
      case 'wrong':
        bgColor = '#3a3a3c';
        break;
      default:
        bgColor = '#3a3a3c';
        break;
    }
  }
  return (
    <div
      className="border-2 border-zinc-700 h-14 min-w-14 flex items-center justify-center text-3xl p-2"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {tile.value.toUpperCase()}
    </div>
  );
}
