import React from "react";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import '../../public/css/Home.css'

interface Game {
    _id:string,
    gameName:string,
    picture:string;
}
const Home:React.FC = () => {

    const [gameLinks,setGameLinks] = useState<Game[]>([]); 
    const [loading, setLoading] = useState(true);
    const {setOnGamePage} = useAuth();
    useEffect(() => { //set homepage with maps and scores for each map.
        setOnGamePage(false);
        fetch('https://photo-tagging-app-pi.vercel.app/api/v1')
        .then(response => response.json())
        .then(data => {
            setGameLinks(data.game)
            setLoading(false);
        })
    },[setOnGamePage]);

    if (loading) {
        return <p data-testid="home">Loading...</p>; // Display a loading indicator while fetching data
    }

    return (
        <div className="homeContainer" data-testid="home">
            <h1 className="centeredText">Choose Your Game</h1>
            <div className="gameContainer">
                {gameLinks.map(game => (
                    <div className="gameItem" key={game._id}>
                        <Link to={`/api/v1/game/${game._id}`} state={{ game }}>
                            <img src={game.picture} alt={game.gameName} />
                            <h2 className="centeredText">{game.gameName}</h2>
                        </Link>
                    </div>       
                ))}
            </div>
        </div>
    );
    
}

export default Home;


{/* <h1>Leader Board</h1>
                            {scoreBoard.filter((board)=> 
                                board.gameScores.some(scoreObj => scoreObj.gameId === game._id)
                            )
                            .flatMap((listItem) =>
                                listItem.gameScores
                                .filter((scoreObj) => scoreObj.gameId === game._id)
                                .map((scoreObj) => ({
                                    username: listItem.username,
                                    score:scoreObj.score
                                }))
                            )
                            .sort((a, b) => a.score.localeCompare(b.score))
                            .map((item) => (
                                <div className="scoreItem" key={item.username}>
                                <h3>{item.username}</h3>
                                <p>{item.score}</p>
                                </div>
                            ))
                            }     */}