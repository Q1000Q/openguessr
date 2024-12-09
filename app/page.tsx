"use client"
import "./page.css"
import { useState } from "react";
import Game from "./game/page";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function Home() {

  const [rounds, setRounds] = useState(5);
  const [time, setTime] = useState(180);
  const [view, setView] = useState("home");

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

  return (view == "home" ? 
    (<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-3 grid-rows-2 gap-8">
          <button onClick={() => setView("game")} className="bg-zinc-600 p-4 px-32 rounded hover:bg-zinc-800 transform transition-colors duration-200 col-span-2">Play Game</button>
          <div className="grid grid-cols-[1fr_6fr_1fr] grid-rows-[2fr_3fr]">
            <h2 className="text-center bg-zinc-600 rounded-t col-span-3">Rounds</h2>
            <button className="bg-zinc-600 rounded-bl hover:bg-zinc-800 transition-colors duration-200" onClick={decreseRounds}>-</button>
            <input onChange={(e) => setRounds(Number(e.target.value))} type="number" name="rounds" id="rounds" value={rounds} className="text-black text-center w-full" />
            <button className="bg-zinc-600 rounded-br hover:bg-zinc-800 transition-colors duration-200" onClick={increseRounds}>+</button>
          </div>
          <div className="bg-zinc-600 rounded flex justify-center items-center">
            <div className="scale-125">
              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Moving" />
              </FormGroup>
            </div>
          </div>
          <div className="bg-zinc-600 rounded flex justify-center items-center">
            <div className="scale-125">
              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Zooming / Panning" />
              </FormGroup>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_6fr_1fr] grid-rows-[2fr_3fr]">
            <h2 className="text-center bg-zinc-600 rounded-t col-span-3">Time Per Round (seconds)</h2>
            <button className="bg-zinc-600 rounded-bl hover:bg-zinc-800 transition-colors duration-200" onClick={decreseTime}>-</button>
            <input onChange={(e) => setTime(Number(e.target.value))} type="number" name="time" id="time" value={time} className="text-black text-center w-full" />
            <button className="bg-zinc-600 rounded-br hover:bg-zinc-800 transition-colors duration-200" onClick={increseTime}>+</button>
          </div>
        </div>
      </main>
    </div>) : view == "game" ? <Game rounds={rounds} time={time}></Game> : ""
  );
}
