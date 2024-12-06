"use client"
import "./page.css"
import LoadGame from "./game/loadGame";
import { useState } from "react";

export default function Home() {

  const [rounds, setRounds] = useState(5);
  const [time, setTime] = useState(180);

  const decreseRounds = async () => {
    if (rounds > 1) {
      setRounds(rounds - 1);
    }
  }
  
  const increseRounds = async () => {
    if (rounds < 100) {
      setRounds(rounds + 1);
    }
  }
  
  const decreseTime = async () => {
    if (time > 30) {
      setTime(time - (time%30 == 0 ? 30 : time%30));
    }
  }
  
  const increseTime = async () => {
    if (time < 3000) {
      setTime(time + 30 - time%30);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-3 grid-rows-2 gap-8">
          <button onClick={() => LoadGame(rounds, time)} className="bg-zinc-600 p-4 px-32 rounded hover:bg-zinc-800 transform transition-colors duration-200 col-span-2">Play Game</button>
          <div>
            <h2 className="text-center bg-zinc-600 rounded-t">Rounds</h2>
            <div className="flex">
              <button className="bg-zinc-600 p-2 px-4 rounded-bl hover:bg-zinc-800 transform transition-colors duration-200" onClick={decreseRounds}>-</button>
              <input onChange={(e) => setRounds(Number(e.target.value))} type="number" name="rounds" id="rounds" value={rounds} className="text-black px-6 py-2 text-center w-full" />
              <button className="bg-zinc-600 p-2 px-4 rounded-br hover:bg-zinc-800 transform transition-colors duration-200" onClick={increseRounds}>+</button>
            </div>
          </div>
          <div>
              <h2 className="text-center bg-zinc-600 rounded-t">Time Per Round (seconds)</h2>
              <div className="flex">
                <button className="bg-zinc-600 p-2 px-4 rounded-bl hover:bg-zinc-800 transform transition-colors duration-200" onClick={decreseTime}>-</button>
                <input onChange={(e) => setTime(Number(e.target.value))} type="number" name="time" id="time" value={time} className="text-black px-6 py-2 text-center w-full" />
                <button className="bg-zinc-600 p-2 px-4 rounded-br hover:bg-zinc-800 transform transition-colors duration-200" onClick={increseTime}>+</button>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
