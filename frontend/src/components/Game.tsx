import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import "../../public/css/Game.css";

interface Character {
  name: string;
  coords: number[];
}

interface Game {
  gameId: string;
  gameName: string;
  characters: Character[];
}
const Game: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);
  const {
    user,
    userCreated,
    minutes,
    seconds,
    setMinutes,
    setSeconds,
    setOnGamePage,
    setTimeStart,
  } = useAuth();

  const [apiCallMade, setApiCallMade] = useState(false);

  const [originalCoords] = useState<Character[]>(state.game.characters);
  const [scaledCoords, setScaledCoords] = useState([...state.game.characters]);
  const [clickedCoords, setClickedCoords] = useState([
    ...state.game.characters,
  ]);

  const [hiddenModal, setHiddenModal] = useState(false);
  const [clickedName, setClickedName] = useState("");
  const [count, setCount] = useState(0);
  const [hiddenModal2, setHiddenModal2] = useState(false);

  const [circleSize, setCircleSize] = useState<number>(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const [isGameWon, setIsGameWon] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.token ? user?.username : "",
    time: "",
    gameId: state.game._id,
  });

  useEffect(() => {
    const startTimer = async () => {
      try {
        const response = await fetch(
          "https://thephototag.com/api/v1/startTime",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ start: Date.now() }),
          }
        );

        if (response.ok) {
          setApiCallMade(true);
          setOnGamePage(true);
          setTimeStart(true);
        } else {
          console.error("failed to start timer");
        }
      } catch (error) {
        console.error("failed to start timer:", error);
      }
    };
    if (!apiCallMade) {
      startTimer();
    }
    const updateImageDimensions = () => {
      if (
        imageRef.current &&
        imageRef.current.naturalWidth !== 0 &&
        imageRef.current.naturalHeight !== 0
      ) {
        const widthScaleFactor =
          imageRef.current.clientWidth / imageRef.current.naturalWidth;
        const heightScaleFactor =
          imageRef.current.clientHeight / imageRef.current.naturalHeight;
        const radiusScaleFactor = Math.sqrt(
          widthScaleFactor * heightScaleFactor
        );
        const scalingFactors = [
          widthScaleFactor,
          heightScaleFactor,
          radiusScaleFactor,
        ];
        const newCircleSize =
          Math.min(
            imageRef.current.clientWidth,
            imageRef.current.clientHeight
          ) / 12;
        setCircleSize(newCircleSize);
        const scaledCoords = originalCoords.map((obj) => ({
          ...obj,
          coords: obj.coords.map(
            (coord: number, index: number) => coord * scalingFactors[index]
          ),
        }));
        setScaledCoords(scaledCoords);
      }
    };

    const handleResize = () => {
      updateImageDimensions();
    };

    if (imageRef.current) {
      updateImageDimensions();
      window.addEventListener("resize", handleResize);
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        hiddenModal &&
        imageRef.current &&
        !imageRef.current.contains(target) &&
        target.tagName !== "AREA"
      ) {
        setHiddenModal(false);
      }
    };
    if (hiddenModal) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    checkwinnner();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCallMade, count, hiddenModal, isGameWon, originalCoords]);

  const handleClick = (
    e:
      | React.MouseEvent<HTMLImageElement, MouseEvent>
      | React.MouseEvent<HTMLAreaElement, MouseEvent>,
    obj: { name: string } | null
  ) => {
    const boundingRect = imageRef.current?.getBoundingClientRect();
    const imageWidth = imageRef.current?.clientWidth;
    const imageHeight = imageRef.current?.clientHeight;

    if (!boundingRect || !imageWidth || !imageHeight) {
      return;
    }
    
    
    let x = e.clientX - boundingRect.left;
    if(imageWidth/2 < x ) {
           x = x-100;
    }
    let y = e.clientY - boundingRect.top;
    if(imageHeight/2 < y ){
      y = e.clientY - boundingRect.top-100;
    }

    setClickedName(obj?.name || "");
    setModalPosition({ x, y });
    setHiddenModal(true);
  };

  const handleClick2 = (clickedObj: string) => {
    const updatedCoords = clickedCoords.map((obj) => {
      if (obj.name === clickedName && obj.name === clickedObj) {
        setCount((count) => count + 1);
        return { ...obj, clicked: true };
      }
      return obj;
    });
    setClickedCoords(updatedCoords);
    setHiddenModal(false);
  };

  const EndTimer = async () => {
    const endTime = Date.now();
    try {
      const response = await fetch(
        "https://thephototag.com/api/v1/game/endTime",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ endTime }),
        }
      );
      if (response.ok) {
        const { elapsedTime } = await response.json();
        const backEndminutes = Math.floor(elapsedTime / 60000);
        const BackEndseconds = Math.floor((elapsedTime % 60000) / 1000);

        if (seconds >= BackEndseconds || minutes >= backEndminutes) {
          setSeconds(seconds);
          setMinutes(backEndminutes);
          setFormData((prevData) => ({
            ...prevData,
            time: `${String(minutes).padStart(2, "0")}:${String(
              seconds
            ).padStart(2, "0")}`,
          }));
        }
      } else {
        console.error("failed to end timer");
      }
    } catch (error) {
      console.error("failed to end timer:", error);
    }
  };

  const checkwinnner = async () => {
    if (count === state.game.characters.length) {
      await EndTimer();
      setTimeStart(false);
      setIsGameWon(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setHiddenModal2(true);
      } else {
        try {
          const response = await fetch(
            "https://thephototag.com/api/v1/game/addOrUpdateTime",
            {
              method: "POST",
              headers: {
                "Content-type": "application/JSON",
              },
              body: JSON.stringify({ formData }),
            }
          );
          if (response.ok) {
            navigate("/api/v1/scores");
          } else {
            console.error(
              "Error adding or updating time:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    }
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        left: e.clientX - rect.left - circleSize / 2,
        top: e.clientY - rect.top - circleSize / 2,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://thephototag.com/api/v1/game/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }),
        }
      );
      if (response.ok) {
        const { token, username } = await response.json();
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        userCreated({ token, username });
        navigate("/api/v1/scores");
      }
    } catch (error) {
      console.error("response not ok " + error);
    }
  };

  return (
    <div className="img-container" data-testid="game">
      <div
        className="magnifier-container"
        onMouseMove={(e) => handleMouseMove(e)}
        style={{ position: "relative" }}
      >
        <img
          ref={imageRef}
          className="magnifier-img"
          src={state.game.picture}
          alt="trialpic"
          useMap="#workmap"
          onClick={(e) => handleClick(e, null)}
          data-testid="game-image"
        />
        <map name="workmap">
          {scaledCoords.map((obj) => (
            <area
              key={obj.name}
              shape="circle"
              coords={obj.coords.join(",")}
              onClick={(e) => handleClick(e, obj)}
              data-testid={`map-area-${obj.name}`}
            />
          ))}
        </map>
        <div
          className={`focus ${isGameWon ? "hidden" : ""}`}
          style={{
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: `${circleSize}px`,
            height: `${circleSize}px`,
          }}
        ></div>
      </div>
      {hiddenModal && (
        <div
          className="characters"
          data-testid="modal-content"
          style={{
            position: "absolute",
            top: modalPosition.y,
            left: modalPosition.x,
            padding: "10px",
            zIndex: 999,
          }}
        >
          {/* <ul > */}
          {clickedCoords.map((obj) =>
            obj.clicked ? null : (
              <li
                className="options"
                onClick={() => handleClick2(obj.name)}
                data-testid={`modal-area-${obj.name}`}
                key={obj.name}
              >
                {obj.name}
              </li>
            )
          )}
          {/* </ul> */}
        </div>
      )}
      {hiddenModal2 && (
        <div
          className="winnerModal"
          data-testid="winner-content"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <p>Enter your name to save your score</p>
            <label htmlFor="score">
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={(e) => handleChange(e)}
              />
            </label>
            <p>Your Time: {formData.time}</p>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Game;
