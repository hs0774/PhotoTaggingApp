import { useState, useEffect } from "react";
import { useAuth } from "../pages/AuthContext";
import '../../public/css/Leaderboard.css';

interface Game {
  _id: string; // Assuming _id is of type string
  gameName: string;
}

interface ScoreObject {
  gameId: string;
  score: string;
  // Add other properties if needed
}
interface Score {
  username: string;
  gameScores: ScoreObject[];
 // Add other properties if needed
}

const Leaderboard: React.FC = () => {
  const [scoreBoard, setScoreBoard] = useState<Score[]>([]);
  const [gameData, setGameData] = useState<Game[]>([]);
  const storedUsername = localStorage.getItem('username');
  const {setOnGamePage} = useAuth();

  useEffect(() => {
    setOnGamePage(false);
    fetch('http://54.160.132.199:5000/api/v1/scores')
      .then(resp => resp.json())
      .then(data => {
        setScoreBoard(data.user);
        setGameData(data.games);
      });
  }, [setOnGamePage]);

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
