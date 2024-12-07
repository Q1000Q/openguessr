export const getRandomCoordsFromLists = async () => {
    const response = await fetch('https://cloud-hejvg3l1y-hack-club-bot.vercel.app/0defaultlist01.json');
    const data = await response.json();
    const locations = await data.locations;

    const randomIndex = Math.floor(Math.random() * locations.length);
    const randomCoords = locations[randomIndex];
  
    return {
        props: {
            lat: randomCoords.lat,
            lng: randomCoords.long,
        }
    };
}

export default getRandomCoordsFromLists;
