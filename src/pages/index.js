import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal';

export default function Home() {

  const router = useRouter();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modal2IsOpen, set2IsOpen] = useState(false);
  const [name, setName] = useState('');
  const [playerLimit, setPlayerLimit] = useState(2);
  const [roomCode, setRoomCode] = useState('');

  function afterOpenModal() {

  }

  function closeModal2() {
    set2IsOpen(false);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const createRoom = async() => {
    const res = await fetch(`${process.env.API_URL}/room/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, playerLimit: playerLimit})
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.access_token);
      window.location.href = '/room';
    } else {
      alert(data.error);
    }
  }

  const joinRoom = async() => {
    const res = await fetch(`${process.env.API_URL}/room/join`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, roomCode: roomCode})
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.access_token);
      window.location.href = '/room';
    } else {
      alert(data.error)
    }
  }

  useEffect(() => {
    console.log(name)
  }, [name])

  useEffect(() => {

    if(!router.isReady) return;

  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Snakes & Ladders</title>
        <meta name="description" content="Play Snakes & Ladders for free!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.centerDiv}>
          <h1>Snakes & Ladders</h1>
          <div className={styles.buttonDiv}>
            <button onClick={() => setIsOpen(true)}>Create Room</button>
            <button onClick={() => set2IsOpen(true)}>Join Room</button>
          </div>
        </div>
      </main>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '35rem',
            background: '#D0B2FF',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderRadius: '20px'
          }
        }}
        contentLabel="Create Room"
      >
        <h2 className={styles.modalHeading}>What's your name</h2>
        <input className={styles.modalInput} onChange={(e) => setName(e.target.value)}></input>
        <h2 className={styles.modalHeading}>Player limit</h2>
        <select className={styles.modalSelect} onChange={(e) => setPlayerLimit(e.target.value)} name="player-limit" id="player-limit">
          <option className={styles.modalOption} value="2">2</option>
          <option className={styles.modalOption} value="3">3</option>
          <option className={styles.modalOption} value="4">4</option>
        </select>
        <div className={styles.modalButtonDiv}><button className={styles.modalButton} onClick={() => createRoom()}>Create Room</button></div>
      </Modal>
      <Modal
        isOpen={modal2IsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal2}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '35rem',
            background: '#D0B2FF',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderRadius: '20px'
          }
        }}
        contentLabel="Join Room"
      >
        <h2 className={styles.modalHeading}>What's your name</h2>
        <input className={styles.modalInput} onChange={(e) => setName(e.target.value)}></input>
        <h2 className={styles.modalHeading}>Enter Room Code</h2>
        <input className={styles.modalInput} onChange={(e) => setRoomCode(e.target.value)}></input>
        <div className={styles.modalButtonDiv}><button className={styles.modalButton} onClick={() => joinRoom()}>Join Room</button></div>
      </Modal>
    </>
  )
}
