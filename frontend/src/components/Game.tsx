import React, { useRef, useEffect,useState } from 'react';
import { useLocation,useParams,useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import '../../public/css/Game.css'

const Game: React.FC = () => {

    const {state} = useLocation();
    const navigate = useNavigate();
    const imageRef = useRef<HTMLImageElement>(null);
    const {user,userCreated,minutes,seconds,setMinutes,
    setSeconds,setOnGamePage,setTimeStart} = useAuth();

    const [apiCallMade, setApiCallMade] = useState(false);

    const [originalCoords] = useState(state.game.characters);
    const [scaledCoords, setScaledCoords] = useState([...state.game.characters]);
    const [clickedCoords, setClickedCoords] = useState([...state.game.characters]);

    const [hiddenModal,setHiddenModal] = useState(false);
    const [clickedName,setClickedName] = useState('');
    const [count,setCount] = useState(0);
    const [hiddenModal2,setHiddenModal2]= useState(false);

    const [circleSize, setCircleSize] = useState<number>(0);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

    const [isGameWon, setIsGameWon] = useState(false);
    const [formData,setFormData] = useState({
        username: user?.token ? user?.username : '',
        time:'',
        gameId:state.game._id,
    });
    
    useEffect(() => {
      const startTimer = async () => {
        try{
          const response = await fetch('http://localhost:5000/api/v1/game/startTime', {
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({start:Date.now()}),
          });
          
          if(response.ok) {
            const message = await response.json();
            console.log(message);
            setApiCallMade(true);
            setOnGamePage(true);
            setTimeStart(true);
          } else {
            console.error('failed to start timer')
          }
        } catch(error){
          console.error('failed to start timer:', error);
        }
      }  
      if (!apiCallMade) {
        startTimer();
      }
      const updateImageDimensions = () => {
        if (imageRef.current && imageRef.current.naturalWidth !== 0 && imageRef.current.naturalHeight !== 0) {
          console.log('natural width',imageRef.current.naturalWidth);
          console.log('natural height',imageRef.current.naturalHeight);
          console.log('Image width:', imageRef.current.clientWidth);
          console.log('Image height:', imageRef.current.clientHeight);
          const widthScaleFactor = imageRef.current.clientWidth/imageRef.current.naturalWidth;
          const heightScaleFactor = imageRef.current.clientHeight/imageRef.current.naturalHeight;
          const radiusScaleFactor = Math.sqrt(widthScaleFactor*heightScaleFactor);
          const scalingFactors = [widthScaleFactor, heightScaleFactor, radiusScaleFactor];
          const newCircleSize = Math.min(imageRef.current.clientWidth, imageRef.current.clientHeight) / 12;
          setCircleSize(newCircleSize);
          console.log('original coords',originalCoords);
          const scaledCoords = originalCoords.map((obj) => ({
              ...obj,
              coords:obj.coords.map((coord,index) => coord * scalingFactors[index]),
          }))
          console.log('scaled coords',scaledCoords)
          setScaledCoords(scaledCoords);
        }
        
      };

      const handleResize = () => {
        console.log('Resize event detected');
        updateImageDimensions();
      };

      if (imageRef.current) {
        updateImageDimensions();
        window.addEventListener('resize', handleResize);
      }
      const handleClickOutside = (event) => {
        if (hiddenModal && imageRef.current && !imageRef.current.contains(event.target) && event.target.tagName !== 'AREA') {
            console.log(event.target.tagName)
            setHiddenModal(false);
        }
        console.log(event.target);
      };
      if (hiddenModal) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }

      checkwinnner();

      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('click', handleClickOutside);
      };
    }, [apiCallMade,count,hiddenModal,isGameWon,originalCoords]);

  const handleClick = (e, obj) => {
    const boundingRect = imageRef.current.getBoundingClientRect();
    const imageWidth = imageRef.current?.clientWidth;
    const imageHeight = imageRef.current?.clientHeight;

    const xClick = e.clientX - boundingRect.left;
    const yClick = e.clientY - boundingRect.top;

    const xRatio = xClick / imageWidth;
    const yRatio = yClick / imageHeight;
    console.log(xRatio,yRatio)
    const xOffset = (xRatio < 0.5 ? 0.045 : -0.125) * imageWidth;
    const yOffset = (yRatio < 0.5 ? -0.01 : -.3) * imageHeight;
    console.log(xOffset,yOffset)
    const x = e.clientX + window.scrollX + xOffset;
    const y = e.clientY + window.scrollY + yOffset;
    console.log(x,y)
    setClickedName(obj?.name || '');
    setModalPosition({ x, y });
    setHiddenModal(true);
  };

  const handleClick2 = (clickedObj) => {
    console.log(clickedName);
    console.log(clickedObj);
    console.log('clicked coords',clickedCoords);
    const updatedCoords = clickedCoords.map((obj) => {
        if(obj.name === clickedName && obj.name===clickedObj){
            setCount(count => count+1)
            return {...obj,clicked:true}
        }
        return obj;
    })
    console.log("updated coords",updatedCoords);

    setClickedCoords(updatedCoords);
     //checkwinnner();
    setHiddenModal(false);
  }

  const EndTimer = async () => {

   const endTime = Date.now();
    try{
      const response = await fetch('http://localhost:5000/api/v1/game/endTime', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({endTime})
      });
      if(response.ok) {
        const {elapsedTime} = await response.json();
        console.log(elapsedTime);
        const backEndminutes = Math.floor(elapsedTime / 60000); 
        const BackEndseconds = Math.floor((elapsedTime % 60000) / 1000);
        //setMinutes(backEndminutes)
        if(seconds >= BackEndseconds || minutes >= backEndminutes) {
          setSeconds(seconds);
          setMinutes(backEndminutes)
            setFormData((prevData) => ({
              ...prevData,
              time:`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
          }));
        }
      } else {
        console.error('failed to end timer')
      }
    } catch(error){
      console.error('failed to end timer:', error);
    } 
  }

  const checkwinnner = async () => {
   if (count === state.game.characters.length){
      await EndTimer();
      setTimeStart(false);
      setIsGameWon(true);
      const token = localStorage.getItem('token')
      if(!token) {
        setHiddenModal2(true);
      } else {
        try {
          const response = await fetch('http://localhost:5000/api/v1/game/addOrUpdateTime', {
            method: 'POST',
            headers: {
              'Content-type': 'application/JSON',
            },
            body: JSON.stringify({formData})
          })
          if(response.ok) {
            console.log('response ok')
            navigate('/api/v1/scores')
          } else {
            console.error('Error adding or updating time:', response.status, response.statusText);
          }
        } catch (error){
          console.error('Fetch error:', error);
        }
      }
   }
  }
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        left: e.clientX - rect.left - circleSize / 2,
        top: e.clientY - rect.top - circleSize / 2,
      });
    }
  };
  
   const handleChange = (e) => {
      const { name,value} = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]:value,
      }));
    }

    const handleSubmit = async (e) => {
     e.preventDefault();
     console.log(formData);
     try {
      const response = await fetch('http://localhost:5000/api/v1/game/createUser', {
        method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({formData}),
        });
        if(response.ok) {
          console.log('response ok')
          const {token,username} = await response.json();
          console.log(username);
          localStorage.setItem('token', token);
          localStorage.setItem('username',username);
          userCreated({token,username})
         // navigate('/api/v1')
        }
     } catch (error) {
      console.error('response not ok ' + error)
     }
    }

    const onClose = (e) => {
     setHiddenModal2(false);
    }

  return (
    <div className='img-container' data-testid="game">
      <div
        className='magnifier-container'
        onMouseMove={(e) => handleMouseMove(e)}
        style={{ position: 'relative' }}
      >
        <img
          ref={imageRef}
          className='magnifier-img'
          src={state.game.picture}
          alt='trialpic'
          useMap='#workmap'
          onClick={(e)=>handleClick(e,null)}
          data-testid="game-image"
        />
        <map name='workmap'>
          {scaledCoords.map((obj) => (
            <area
              key={obj.name}
              shape='circle'
              coords={obj.coords.join(',')}
              onClick={(e)=>handleClick(e,obj)}
              data-testid={`map-area-${obj.name}`}
            />
          ))}
        </map>
        <div
        className={`focus ${isGameWon ? 'hidden' : ''}`}
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
        }}
      ></div>
      </div> 
      {hiddenModal && <div className='characters' data-testid='modal-content' style={{
            position: 'absolute',
            top: modalPosition.y,
            left: modalPosition.x,
            padding: '10px',
            zIndex: 999,
          }}
          >
        {/* <ul > */}
            {clickedCoords.map((obj) => (
               obj.clicked ? null : <li className='options' onClick={()=>handleClick2(obj.name)} data-testid={`modal-area-${obj.name}`}  key={obj.name}>{obj.name}</li>
            ))}
        {/* </ul> */}
      </div>}
      {hiddenModal2 && <div className='winnerModal' data-testid='winner-content' style = {{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        }}>
        {/* <p>Enter your name to save your score</p> */}
        <form  onSubmit={(e) => handleSubmit(e)}>
        {/* <button className="close-button" onClick={onClose}>
          &times;
        </button> */}
        <p>Enter your name to save your score</p>
            <label htmlFor="score">
            <input type="text" name= "username" value={formData.username} onChange={(e) => handleChange(e)} /></label>
            <p>Your Time: {formData.time}</p>
            <button type="submit">Submit</button>
        </form>
        </div>
    }
    </div>
  );
};

export default Game;

//change pic size to be uniform across all game pages, add a list of items 
//change modal so it opens near your click
//change pic on home to be same size
//consider changing "34" radius for some images like well and chick 
//consdier adding circle size as part of Game schema, and setting it before for 
//custom circle size per image,

//on the side or maybe even nav so they know what to look for beforehand (maybe later)

