import React from "react";
import { useState,useEffect } from "react";
// import { Link } from "react-router-dom";

const Home:React.FC = () => {

    // const [gameLinks,setGameLinks] = useState([]); 
    // const [scoreBoard,setScoreBoard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { //set homepage with maps and scores for each map.
        fetch('http://localhost:5000/api/v1')
        .then(response => response.json())
        .then(data => {
            // setGameLinks(data.games)
            // setScoreBoard(data.scoreBoard);
            setLoading(false);
        })
    },[]);

    if (loading) {
        return <p>Loading...</p>; // Display a loading indicator while fetching data
    }

    return (
        <div className="homeContainer" data-testid="home">
            <h1>Choose Your Game</h1>
            {/* <div className="gameContainer">
                {gameLinks.map(game => (
                    <div className="gameItem" key={game.id}>    
                        <Link to={`/api/v1/game/${game.id}`}>
                            <img src={game.image} alt={game.name} />
                            <p>{game.name}</p>
                        </Link>
                    </div>    
                ))}
            </div>
            <div className="scoreContainer">
                {scoreBoard.map(board => (
                    <div className="board" key={board.gameId}>
                        <h3>{board.name}</h3>
                        {board.list.map(listItem => (
                            <div className="scoreItem" key={listItem.id}>    
                                <p>{listItem.user}</p>
                                <p>{listItem.score}</p>
                            </div> 
                        ))}
                    </div> 
                ))}
            </div> */}
        </div>
    );
    
}

export default Home;