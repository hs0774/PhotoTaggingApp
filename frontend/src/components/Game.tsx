import React, { useRef, useEffect,useState } from 'react';
import { useLocation,useParams,useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import '../../public/css/Game.css'

const Game: React.FC = () => {
    const {state} = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const {token,user,userCreated,minutes,seconds,setMinutes,setSeconds,setOnGamePage,setTimeStart} = useAuth();
 // console.log('state',state.game)
    const [originalCoords] = useState(state.game.characters);
    const [scaledCoords, setScaledCoords] = useState([...state.game.characters]);
    const [clickedCoords, setClickedCoords] = useState([...state.game.characters]);
    const [hiddenModal,setHiddenModal] = useState(false);
    const [hiddenModal2,setHiddenModal2]= useState(false);
    const [clickedName,setClickedName] = useState('');
    const [count,setCount] = useState(0);
    const imageRef = useRef<HTMLImageElement>(null);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    // const [minutes, setMinutes] = useState(0);
    // const [seconds, setSeconds] = useState(0);
    const [isGameWon, setIsGameWon] = useState(false);
    const [formData,setFormData] = useState({
        username: user?.token ? user?.username : '',
        time:'',
        gameId:id,
    });
    const [apiCallMade, setApiCallMade] = useState(false);
    const [starttt,setStarttt]=useState(0);
    const circleSize = 100;
   // const {state} = useLocation();
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
            setStarttt(message.start);
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
        if (imageRef.current) {
          console.log('natural width',imageRef.current.naturalWidth);
          console.log('natural height',imageRef.current.naturalHeight);
          console.log('Image width:', imageRef.current.clientWidth);
          console.log('Image height:', imageRef.current.clientHeight);
          const widthScaleFactor = imageRef.current.clientWidth/imageRef.current.naturalWidth;
          const heightScaleFactor = imageRef.current.clientHeight/imageRef.current.naturalHeight;
          const radiusScaleFactor = Math.sqrt(widthScaleFactor*heightScaleFactor);
          const scalingFactors = [widthScaleFactor, heightScaleFactor, radiusScaleFactor];
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
    // let interval;

    // const updateTimer = () => {
    //   setSeconds((prevSeconds) => {
    //     const newSeconds = prevSeconds + 1;
    //     if (newSeconds === 60) {
    //       setMinutes((prevMinutes) => prevMinutes + 1);
    //       return 0;
    //     }
    //     return newSeconds;
    //   });
    // };
  
    // if (!isGameWon) {
    //   interval = setInterval(updateTimer, 1000);
    // }

    checkwinnner();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      // clearInterval(interval);
    };
  }, [apiCallMade,count,hiddenModal,isGameWon,originalCoords]);

  const handleClick = (e,obj) => {
   //   const target = e.target as HTMLImageElement;
    const boundingRect = imageRef.current.getBoundingClientRect();

    const xClick = e.clientX - boundingRect.left;
    const yClick = e.clientY - boundingRect.top;

    const imageWidth = imageRef.current?.clientWidth;
    const imageHeight = imageRef.current?.clientHeight;
    console.log(imageWidth,imageHeight,xClick,yClick)
    //console.log(e.clientX,e.clientY+90,scaledCoords)
    let x,y;

    if(xClick < imageWidth/2){
        x = e.clientX + window.scrollX+46;
    } else {
        x = e.clientX + window.scrollX-181;
    }  

    if(yClick < imageHeight/2 && yClick>115 || yClick> imageHeight-140){
        y = e.clientY + window.scrollY-200;
    } else {
        y = e.clientY + window.scrollY-60;
    }

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
   const endTime = Date.now()
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
            navigate('/api/v1')
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
          navigate('/api/v1')
        }
     } catch (error) {
      console.error('response not ok ' + error)
     }
   }

   const onClose = (e) => {
    setHiddenModal2(false);
   }

  return (
    <div className='img-container'>
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
          className='focus'
          style={{
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: `${circleSize}px`,
            height: `${circleSize}px`,
          }}
        ></div>
      </div> {/*make modal on a sep module */}
      {hiddenModal && <div className='characters' data-testid='modal-content' style={{
            position: 'absolute',
            top: modalPosition.y,
            left: modalPosition.x,
            border: '1px solid black',
            padding: '10px',
            backgroundColor: 'white',
            zIndex: 999,
          }}
          >
        {/* <ul > */}
            {clickedCoords.map((obj) => (
               obj.clicked ? null : <li className='options' onClick={()=>handleClick2(obj.name)}  key={obj.name}>{obj.name}</li>
            ))}
        {/* </ul> */}
      </div>}
      {/* <p>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p> */}
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
        <p>Enter your name to save your score</p>
        <form style = {{background:'white'}} onSubmit={(e) => handleSubmit(e)}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
            <label htmlFor="score">Name:
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


    //left
    // const x = e.clientX + window.scrollX-181; // Adjust for horizontal scroll
    // const y = e.clientY + window.scrollY-140;
    //right
    // const x = e.clientX + window.scrollX+46; // Adjust for horizontal scroll
    // const y = e.clientY + window.scrollY-140;
    //up
    // const x = e.clientX + window.scrollX-70; // Adjust for horizontal scroll
    // const y = e.clientY + window.scrollY-248;
    //down
    // const x = e.clientX + window.scrollX-68; // Adjust for horizontal scroll
    // const y = e.clientY + window.scrollY-33;