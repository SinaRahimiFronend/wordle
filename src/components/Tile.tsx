import { LetterTile } from '../types/types';

export default function Tile({
  tile,
  keyboard = false,
}: {
  tile: LetterTile;
  keyboard?: boolean;
}) {
  let bgColor = '#000';
  switch (tile.status) {
    case 'correct':
      bgColor = '#538d4e';
      break;
    case 'misplaced':
      bgColor = '#b59f3b';
      break;
    case 'wrong':
      bgColor = '#3a3a3c';
      break;
    case 'idle':
      bgColor = '#818384';
      break;
    default:
      bgColor = '#000';
      break;
  }
  return (
    <div
      className="border-2 h-14 min-w-14 flex items-center justify-center text-3xl p-2"
      style={{
        backgroundColor: bgColor,
        borderColor: keyboard
          ? 'transparent'
          : tile.value
          ? '#818384'
          : '#565758',
        borderRadius: keyboard ? '10px' : '0',
      }}
    >
      {tile.value.toUpperCase()}
    </div>
  );
}
