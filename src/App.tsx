import { useEffect, useState } from 'react';
import './App.css'
import Overlay from './pages/Overlay';

function App() {
  const [lastKey, setLastKey] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("키 눌림:", event.key);
      setLastKey(event.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
  <div>
    테스트 화면 입니다
    <p>마지막으로 누른 키: {lastKey}</p>
    <Overlay/>
  </div>
  )
}

export default App
