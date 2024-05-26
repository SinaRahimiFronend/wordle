export default function VictoryDialog({
  text,
  handleReset,
}: {
  text: string;
  handleReset: () => void;
}) {
  return (
    <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center">
      <div className="bg-white w-2/5 text-black rounded text-center text-3xl font-bold py-8 flex flex-col items-center">
        {text}
        <button
          className=" bg-blue-700 py-4 px-8 rounded-xl text-white mt-4"
          onClick={handleReset}
        >
          Play again
        </button>
      </div>
    </div>
  );
}
