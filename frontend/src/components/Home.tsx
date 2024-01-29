import React from "react";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import '../../public/css/Home.css'

const Home:React.FC = () => {

     const [gameLinks,setGameLinks] = useState([]); 
     const [scoreBoard,setScoreBoard] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setOnGamePage} = useAuth();
    useEffect(() => { //set homepage with maps and scores for each map.
        setOnGamePage(false);
        fetch('http://localhost:5000/api/v1')
        .then(response => response.json())
        .then(data => {
            console.log(data.user)
            console.log(data.game)
            setGameLinks(data.game)
            setScoreBoard(data.user);
            setLoading(false);

        })
    },[]);
    if (loading) {
        return <p>Loading...</p>; // Display a loading indicator while fetching data
    }

    return (
        <div className="homeContainer" data-testid="home">
            <h1>Choose Your Game</h1>
            <div className="gameContainer">
            {console.log(gameLinks)}
                {gameLinks.map(game => (
                    <div className="gameItem" key={game._id}>
                        {console.log(game)}
                        <Link to={`/api/v1/game/${game._id}`} state={{ game }}>
                            <img src={game.picture} alt={game.gameName} />
                            <p>{game.gameName}</p>
                        </Link>
                        <h1>Leader Board</h1>
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
                        }    
                    </div>    
                ))}
            </div>
        </div>
    );
    
}

export default Home;