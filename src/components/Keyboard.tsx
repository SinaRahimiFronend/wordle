import { useMemo } from "react";
import { LetterTile } from "../types/types";
import Tile from "./Tile";

export default function Keyboard({
  handleKeyPress,
  usedLetters,
}: {
  handleKeyPress: (key: string) => void;
  usedLetters: LetterTile[];
}) {
  const letters = useMemo(
    () =>
      [
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "Enter",
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        "Backspace",
      ].map((letter) => {
        // to check if keyboard letter is used in any try or not
        const matchedLetter =
          usedLetters.find(
            (tile) =>
              tile.value.toLocaleLowerCase() === letter &&
              tile.status === "correct"
          ) ||
          usedLetters.find((tile) => tile.value.toLocaleLowerCase() === letter); // to prioritize correct letters over misplaced ones
        return {
          status: matchedLetter ? matchedLetter.status : "idle",
          value: letter,
          id: letter,
        };
      }),
    [usedLetters]
  );

  return (
    <div className="text-white max-w-[690px] flex flex-wrap justify-center gap-2 mx-auto mt-24">
      {letters.map((letter) => (
        <button key={letter.id} onClick={() => handleKeyPress(letter.value)}>
          <Tile tile={letter} keyboard />
        </button>
      ))}
    </div>
  );
}
