import { redirect } from "next/navigation";

export default async function LoadGame(rounds: Number, time: Number) {
    redirect("/game");
}