import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultDialog from './ResultDialog';

interface Row {
  id: number;
  tiles: Tile[];
  isCompleted: boolean;
}

interface Tile {
  id: string;
  value: string;
  status: 'exists' | 'correct' | 'wrong';
}

export default function Board() {
  const [words, setWords] = useState<string[]>(['', '', '', '', '']);
  const [activeTry, setActiveTry] = useState(0);

  const [hiddenWord, setHiddenWord] = useState('PLINE');

  const rows = useMemo<Row[]>(() => {
    const newRows: Row[] = [];
    for (let i = 0; i < 5; i++) {
      const newRow: Row = { id: i, tiles: [], isCompleted: activeTry > i };
      for (let j = 0; j < 5; j++) {
        newRow.tiles.push({
          id: String(i) + String(j),
          value: words[i][j] || '',
          status:
            hiddenWord[j] === words[i][j]
              ? 'correct'
              : hiddenWord.includes(words[i][j])
              ? 'exists'
              : 'wrong',
        });
      }
      newRows.push(newRow);
    }
    return newRows;
  }, [words, activeTry, hiddenWord]);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= 'a' && e.key <= 'z') {
        setWords(prevWords => {
          const newWords = [...prevWords];
          if (newWords[activeTry].length < 5) {
            newWords[activeTry] += e.key.toLocaleUpperCase();
          }
          return newWords;
        });
      } else if (e.key === 'Backspace') {
        setWords(prevWords => {
          const newWords = [...prevWords];
          newWords[activeTry] = newWords[activeTry].slice(0, -1);

          return newWords;
        });
      } else if (e.key === 'Enter') {
        if (words[activeTry].length === 5) setActiveTry(prev => prev + 1);
        else console.log('wrong');
      }
    },
    [activeTry, words]
  );

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  function handleGameReset() {
    setWords(['', '', '', '', '']);
    setActiveTry(0);
  }

  const matchedWordIndex = words.findIndex(word => word === hiddenWord);

  const isLost = matchedWordIndex === -1 && activeTry === 5;
  const isVictory = matchedWordIndex !== -1 && activeTry > matchedWordIndex;

  return (
    <div className="text-white mx-auto w-max max-w-l p-1 mt-12 flex flex-col gap-2">
      {rows.map((row, i) => (
        <Row key={row.id} row={row} active={activeTry > i} />
      ))}
      {isVictory && (
        <ResultDialog text="You Have won🎉" handleReset={handleGameReset} />
      )}
      {isLost && (
        <ResultDialog text="You Have Lost!!😥" handleReset={handleGameReset} />
      )}
    </div>
  );
}

function Row({ row, active }: { row: Row; active: boolean }) {
  return (
    <div className="flex gap-2">
      {row.tiles.map(tile => (
        <Tile key={tile.id} tile={tile} active={active} />
      ))}
    </div>
  );
}

function Tile({ tile, active }: { tile: Tile; active: boolean }) {
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
      className="border-2 border-zinc-700 h-14 w-14 flex items-center justify-center text-3xl"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {tile.value.toUpperCase()}
    </div>
  );
}
