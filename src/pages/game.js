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
      } else {
        alert(data.error);
        window.location.href = '/'
      }
  }

  const rollDice = async() => {
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
            <h1>You are on: 0</h1>
            <h2>You arrived on 7 and encontered a snake.</h2>
            {
                players.map((player) => (
                    <div className={styles.playerDiv}>
                        <img src="https://picsum.photos/200"/>
                        <h2 className={styles.playerName}>{`${admin == player._id ? `${player.name} (Admin)`: name == player.name ? `${player.name} (You)` : player.name}: 0`}</h2>
                    </div>
                ))
            }
            <button className={styles.startButton} onClick={rollDice}>Roll dice</button>
          </div>     
        </div>
      </main>
      
    </>
  )
}
