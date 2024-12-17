const BackButton = () => {
    const backButtonHander = () => {
        localStorage.removeItem("currentRound");
        localStorage.removeItem("currentTime");
        localStorage.removeItem("locationLat");
        localStorage.removeItem("locationLng");
        localStorage.removeItem("points");
        localStorage.removeItem("view");
        localStorage.removeItem("lobbyId");


        localStorage.setItem("mainView", "home");
        location.reload();
    }

    return (
        <button onClick={backButtonHander} className='absolute z-50 top-4 left-4 bg-black/70 p-4 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
    )
}

export default BackButton;