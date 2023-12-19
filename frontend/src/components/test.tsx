import { useState,useEffect } from "react";

const Test:React.FC = () => {
    const [testData,setTestData] = useState('');
    useEffect(() => {
        fetch('http://localhost:5000')
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setTestData(data);
        })
    })
    return (
        <>
        <h1>{testData}</h1>
        </>
    )
}

export default Test;