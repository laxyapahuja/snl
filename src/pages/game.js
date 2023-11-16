import Head from 'next/head'
import styles from '@/styles/Game.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client'

export default function Game() {

  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isTurn, setIsTurn] = useState(false);
  const [currentPos, setCurrentPos] = useState(0);
  const [message, setMessage] = useState("")
  const [dice, setDice] = useState(0)

  const socket = io.connect(process.env.API_URL, {query: `room=${roomCode}`});

  const getRoomDetails = async() => {
    const res = await fetch(`${process.env.API_URL}/room?token=${localStorage.getItem('token')}`);
      const data = await res.json();
      if (data.success) {
        setRoomCode(data.room_code);
        setIsAdmin(data.is_admin);
        setAdmin(data.room_admin);
        setName(data.name);
        setPlayers([...data.players])
        setIsTurn(data.is_turn)
        setCurrentPos(data.current_position)
        if (data.status == 'WAITING') {
          window.location.href = `/room`;
        }
        if (data.status == 'ENDED') {
          alert('Game has ended');
          window.location.href = `/`;
        }
      } else {
        alert(data.error);
        window.location.href = '/'
      }
  }

  const rollDice = async() => {
    const res = await fetch(`${process.env.API_URL}/room/dice?token=${localStorage.getItem('token')}`);
    const data = await res.json();
    if (data.success) {
      socket.emit('roll', roomCode);
      socket.emit('join', roomCode);
      setDice(data.dice);
      setMessage(data.message);
      setCurrentPos(data.current_position);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {

    if(!router.isReady) return;
    getRoomDetails();

  }, [router.isReady]);

  
  useEffect(() => {

    socket.on("connect", async () => {
      await fetch(`${process.env.API_URL}/player/socket?token=${localStorage.getItem('token')}&socket=${socket.id}`);
    });
    socket.on("join", async() => {
      getRoomDetails();
    })
    socket.on("start", async() => {
      window.location.href = `/game`;
    })
    socket.on("roll", async() => {
      getRoomDetails();
    })
    socket.emit('join', roomCode);
  },[])

  return (
    <>
      <Head>
        <title>Snakes & Ladders</title>
        <meta name="description" content="Play Snakes & Ladders for free!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
            <h1>Snakes & Ladders</h1>
        </div>
        <div className={styles.contentDiv}>
          <img className={styles.board} src='board.jpg'/>
          <div>
            <h1>You are on: {currentPos}</h1>
            <h2>{message}</h2>
            {
                players.map((player) => (
                    <div className={styles.playerDiv}>
                        <img src="https://picsum.photos/200"/>
                        <h2 className={styles.playerName}>{`${admin == player._id ? `${player.name} (Admin)`: name == player.name ? `${player.name} (You)` : player.name}: ${player.current_position}`}</h2>
                    </div>
                ))
            }
            {isTurn ? (<button className={styles.startButton} onClick={rollDice}>Roll dice</button>) : ''}
          </div>     
        </div>
      </main>
      
    </>
  )
}
