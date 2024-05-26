import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultDialog from './ResultDialog';
import { TilesRow } from '../types/types';
import Tile from './Tile';
import Keyboard from './Keyboard';

const hiddenWord = 'PLINE';

export default function Board() {
  const [words, setWords] = useState<string[]>(['', '', '', '', '', '']);
  const [activeTry, setActiveTry] = useState(0);

  const rows = useMemo<TilesRow[]>(() => {
    const newRows: TilesRow[] = [];
    for (let i = 0; i < 6; i++) {
      const newRow: TilesRow = { id: i, tiles: [], isCompleted: activeTry > i };
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
  }, [words, activeTry]);

  const handleKeyUp = useCallback(
    (key: string) => {
      if (activeTry > words.length) return;
      if (key >= 'a' && key <= 'z') {
        setWords(prevWords => {
          const newWords = [...prevWords];
          if (newWords[activeTry].length < 5) {
            newWords[activeTry] += key.toLocaleUpperCase();
          }
          return newWords;
        });
      } else if (key === 'Backspace') {
        setWords(prevWords => {
          const newWords = [...prevWords];
          newWords[activeTry] = newWords[activeTry].slice(0, -1);

          return newWords;
        });
      } else if (key === 'Enter') {
        if (words[activeTry].length === 5) setActiveTry(prev => prev + 1);
        else console.log('wrong');
      }
    },
    [activeTry, words]
  );

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      handleKeyUp(e.key);
    }

    document.addEventListener('keyup', handleKeyPress);

    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, [handleKeyUp]);

  function handleGameReset() {
    setWords(['', '', '', '', '', '']);
    setActiveTry(0);
  }

  const matchedWordIndex = words.findIndex(word => word === hiddenWord);

  const isLost = matchedWordIndex === -1 && activeTry === words.length;
  const isVictory = matchedWordIndex !== -1 && activeTry > matchedWordIndex;

  return (
    <div>
      <div className="text-white mx-auto w-max max-w-l p-1 mt-12 flex flex-col gap-2">
        {rows.map((row, i) => (
          <Row key={row.id} row={row} active={activeTry > i} />
        ))}
      </div>
      <Keyboard
        handleKeyPress={handleKeyUp}
        checkedLetters={rows
          .slice(0, activeTry)
          .map(row => row.tiles)
          .flat()
          .filter(tile => !!tile.value)}
      />
      {isVictory && (
        <ResultDialog text="You Have won🎉" handleReset={handleGameReset} />
      )}
      {isLost && (
        <ResultDialog text="You Have Lost!!😥" handleReset={handleGameReset} />
      )}
    </div>
  );
}

function Row({ row, active }: { row: TilesRow; active: boolean }) {
  return (
    <div className="flex gap-2">
      {row.tiles.map(tile => (
        <Tile key={tile.id} tile={tile} active={active} />
      ))}
    </div>
  );
}
