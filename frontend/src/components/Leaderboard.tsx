import { useState, useEffect } from "react";
import { useAuth } from "../pages/AuthContext";
import '../../public/css/Leaderboard.css';

const Leaderboard: React.FC = () => {
  const [scoreBoard, setScoreBoard] = useState([]);
  const [gameData, setGameData] = useState([]);
  const storedUsername = localStorage.getItem('username');
  const {setOnGamePage} = useAuth();

  useEffect(() => {
    setOnGamePage(false);
    fetch('http://localhost:5000/api/v1/scores')
      .then(resp => resp.json())
      .then(data => {
        setScoreBoard(data.user);
        setGameData(data.games);
      });
  }, []);

  return (
    <div className="leaderboard-container" data-testid='leaderboard'>
      {gameData.map((game) => (
        <div className="game-container" key={game._id}>
          <h2>{game.gameName}</h2>
          {scoreBoard
            .filter((board) =>
              board.gameScores.some((scoreObj) => scoreObj.gameId === game._id)
            )
            .flatMap((listItem) =>
              listItem.gameScores
                .filter((scoreObj) => scoreObj.gameId === game._id)
                .map((scoreObj) => ({
                  username: listItem.username,
                  score: scoreObj.score,
                }))
            )
            .sort((a, b) => a.score.localeCompare(b.score))
            .map((item) => (
              <div className="scoreItem" key={item.username}>
                <h3 className={item.username === storedUsername ? 'highlighted' : ''}>
                  {item.username}
                </h3>
                <p>{item.score}</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
