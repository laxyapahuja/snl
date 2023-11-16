import Head from 'next/head'
import styles from '@/styles/Room.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client'

export default function Room() {

  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const socket = io.connect(process.env.API_URL, {query: `room=${roomCode}`});

  const getRoomDetails = async() => {
    const res = await fetch(`${process.env.API_URL}/room?token=${localStorage.getItem('token')}`);
      const data = await res.json();
      if (data.success) {
        setRoomCode(data.room_code);
        setIsAdmin(data.is_admin);
        setAdmin(data.room_admin);
        setName(data.name);
        setPlayers(data.players)
        if (data.status == 'RUNNING') {
          window.location.href = `/game`;
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

  const startGame = async() => {
    const res = await fetch(`${process.env.API_URL}/room/start?token=${localStorage.getItem('token')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json();
    if (data.success) {
      socket.emit('start', roomCode);
      window.location.href = `/game`;
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
      console.log('hello')
      window.location.href = `/game`;
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
        <div className={styles.header} onClick={() => {window.location.href = '/'}}>
            <h1>Snakes & Ladders</h1>
        </div>
        <div className={styles.contentDiv}>
            <h1>Room Code: {roomCode}</h1>
            {
                players.map((player) => (
                    <div className={styles.playerDiv}>
                        <img src="https://picsum.photos/200"/>
                        <h2 className={styles.playerName}>{admin == player._id ? `${player.name} (Admin)`: name == player.name ? `${player.name} (You)` : player.name }</h2>
                    </div>
                ))
            }
        </div>
        {isAdmin ? (<button className={styles.startButton} onClick={startGame}>Start Game</button>) : (null)}
      </main>
      
    </>
  )
}
