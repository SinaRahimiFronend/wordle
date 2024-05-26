import { useCallback, useEffect, useMemo, useState } from "react";
import ResultDialog from "./ResultDialog";
import { TilesRow } from "../types/types";
import Tile from "./Tile";
import Keyboard from "./Keyboard";

const hiddenWord = "PLINE";

export default function Board() {
  const [words, setWords] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeTry, setActiveTry] = useState(0);

  const rows = useMemo<TilesRow[]>(() => {
    // creating board rows and tiles based on letters entered
    const newRows: TilesRow[] = [];
    for (let i = 0; i < 6; i++) {
      const newRow: TilesRow = { id: i, tiles: [], isCompleted: activeTry > i };
      for (let j = 0; j < 5; j++) {
        newRow.tiles.push({
          id: String(i) + String(j),
          value: words[i][j] || "",
          status:
            activeTry > i // checks if this try is finished
              ? hiddenWord[j] === words[i][j] // comparing values of each tile and corresponding letter of hiddenWord
                ? "correct"
                : hiddenWord.includes(words[i][j])
                ? "misplaced"
                : "wrong"
              : "empty",
        });
      }
      newRows.push(newRow);
    }
    return newRows;
  }, [words, activeTry]);

  const handleKeyUp = useCallback(
    (key: string) => {
      if (activeTry > words.length) return;
      if (key >= "a" && key <= "z") {
        setWords((prevWords) => {
          const newWords = [...prevWords];
          if (newWords[activeTry].length < 5) {
            newWords[activeTry] += key.toLocaleUpperCase();
          }
          return newWords;
        });
      } else if (key === "Backspace") {
        setWords((prevWords) => {
          const newWords = [...prevWords];
          newWords[activeTry] = newWords[activeTry].slice(0, -1);

          return newWords;
        });
      } else if (key === "Enter") {
        if (words[activeTry].length === 5) setActiveTry((prev) => prev + 1);
        else console.log("wrong");
      }
    },
    [activeTry, words]
  );

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      handleKeyUp(e.key);
    }

    document.addEventListener("keyup", handleKeyPress);

    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [handleKeyUp]);

  function handleGameReset() {
    setWords(["", "", "", "", "", ""]);
    setActiveTry(0);
  }

  const matchedWordIndex = words.findIndex((word) => word === hiddenWord);

  const isDefeat = matchedWordIndex === -1 && activeTry === words.length;
  const isVictory = matchedWordIndex !== -1 && activeTry > matchedWordIndex;

  return (
    <div>
      <div className="text-white mx-auto w-max max-w-l p-1 mt-12 flex flex-col gap-2">
        {rows.map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </div>
      <Keyboard
        handleKeyPress={handleKeyUp}
        usedLetters={rows
          .slice(0, activeTry)
          .map((row) => row.tiles)
          .flat()}
      />
      {isVictory && (
        <ResultDialog text="You Have won🎉" handleReset={handleGameReset} />
      )}
      {isDefeat && (
        <ResultDialog text="You Have Lost!!😥" handleReset={handleGameReset} />
      )}
    </div>
  );
}

function Row({ row }: { row: TilesRow }) {
  return (
    <div className="flex gap-2">
      {row.tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  );
}
