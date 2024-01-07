import React, { useRef, useEffect,useState } from 'react';
import trialpic from '../../public/images/trialpic.jpg'
import '../../public/css/Game.css'

const obj = [
    {
    name:'Tarzan',
    coordinates: [309,223,34],
    clicked:false,
    },
    {
    name:'Tigger',
    coordinates: [409,323,34],
    clicked:false,
    },
    {
    name:'Chien-Po',
    coordinates: [209,123,34],
    clicked:false,
    },
]

const Game: React.FC = () => {
    const [originalCoords] = useState(obj);
    const [scaledCoords, setScaledCoords] = useState([...obj]);
    const [clickedCoords, setClickedCoords] = useState([...obj]);
    const [hiddenModal,setHiddenModal] = useState(false);
    const [clickedName,setClickedName] = useState('');
    const [count,setCount] = useState(0);
    const imageRef = useRef<HTMLImageElement>(null);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const circleSize = 100; 

  useEffect(() => {
     
    const updateImageDimensions = () => {
      if (imageRef.current) {
        console.log(imageRef.current.naturalWidth);
        console.log(imageRef.current.naturalHeight);
        console.log('Image width:', imageRef.current.clientWidth);
        console.log('Image height:', imageRef.current.clientHeight);
        const widthScaleFactor = imageRef.current.clientWidth/imageRef.current.naturalWidth;
        const heightScaleFactor = imageRef.current.clientHeight/imageRef.current.naturalHeight;
        const radiusScaleFactor = Math.sqrt(widthScaleFactor*heightScaleFactor);
        const scalingFactors = [widthScaleFactor, heightScaleFactor, radiusScaleFactor];
       // console.log(originalCoords);
        const scaledCoords = originalCoords.map((obj) => ({
            ...obj,
            coordinates:obj.coordinates.map((coord,index) => coord * scalingFactors[index]),
        }))
        // const scaledCoords = coords.map((obj) => {
        //     const existingObj = coords.find((coordObj) => coordObj.name === obj.name);
        //     if (existingObj) {
        //       return {
        //         ...existingObj,
        //         coordinates: obj.coordinates.map((coord, index) => coord * scalingFactors[index]),
        //       };
        //     }
        //     return obj;
        // });
        console.log(scaledCoords)
        setScaledCoords(scaledCoords);
      }
    };

    const handleResize = () => {
      updateImageDimensions();
    };

    if (imageRef.current) {
      imageRef.current.onload = () => {
        updateImageDimensions(); // Log dimensions after image is loaded
        window.addEventListener('resize', handleResize);
      };
    }
    
    //updateImageDimensions();
    console.log(count);
    checkwinnner();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  const handleClick = (e,obj) => {

    const target = e.target as HTMLImageElement;
    const boundingRect = target.getBoundingClientRect();
    const xClick = e.clientX - boundingRect.left;
    const yClick = e.clientY - boundingRect.top;
    // console.log(e.clientX, e.clientY, x, y);
   // console.log(e,obj);
    // const x = e.clientX;
    // const y = e.clientY;
    const imageWidth = imageRef.current?.clientWidth;
    const imageHeight = imageRef.current?.clientHeight;
    console.log(imageWidth,imageHeight,xClick,yClick)

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

    setClickedName(obj?.name || '');
  
    setModalPosition({ x, y });
    //console.log(obj.name)
    setHiddenModal(true);
    // handleClick2(obj);
    // console.log(e);
    // console.log(coords[0].coordinates,coords[1].coordinates,coords[2].coordinates);
    
  };

  const handleClick2 = (clickedObj) => {
    console.log(clickedName);
    console.log(clickedObj);
    console.log(clickedCoords);
    const updatedCoords = clickedCoords.map((obj) => {
        if(obj.name === clickedName && obj.name===clickedObj){
            setCount(count => count+1)
            return {...obj,clicked:true}
        }
        return obj;
    })
    console.log(updatedCoords);

    setClickedCoords(updatedCoords);
    // checkwinnner();
    setHiddenModal(false);
   // setHiddenModal(false);
    
    // setTimeout(() => {
    //     console.log(updatedCoords); // Log the updated state after a delay
    //   }, 3000);
    // console.log(clickedCoords[0].coordinates,clickedCoords[1].coordinates,clickedCoords[2].coordinates);    

}

  const checkwinnner = () => {
   if (count === obj.length){
    console.log('winner')
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
          src={trialpic}
          alt='trialpic'
          useMap='#workmap'
          onClick={handleClick}
        />
        <map name='workmap'>
          {scaledCoords.map((obj) => (
            <area
              key={obj.name}
              shape='circle'
              coords={obj.coordinates.join(',')}
              onClick={(e)=>handleClick(e,obj)}
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
      </div>
      {hiddenModal && <div className='characters' style={{
            position: 'absolute',
            top: modalPosition.y,
            left: modalPosition.x,
            border: '1px solid black',
            padding: '10px',
            backgroundColor: 'white',
            zIndex: 999,
          }}>
        <ul >
            {clickedCoords.map((obj) => (
               obj.clicked ? null : <li className='options' onClick={()=>handleClick2(obj.name)}  key={obj.name}>{obj.name}</li>
            ))}
        </ul>
      </div>}
    </div>
  );
};

export default Game;
