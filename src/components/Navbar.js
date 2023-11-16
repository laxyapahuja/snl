import styles from '@/styles/Navbar.module.css'
import Searchbar from './Searchbar'
import { useEffect, useState } from 'react';

export default function Navbar({color}) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartNumber, setCartNumber] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }

    const getCount = async() => {
        let result = await fetch(`${process.env.API_URL}/cart/count?accesstoken=${localStorage.getItem('token')}`);
        let data = await result.json();
        if (data.success) {
            setCartNumber(data.count);
        } else {
        }
    }

    try {
        getCount();
    } catch (err) {
        console.log(err);
    }

  }, []);


  return (
    <>
        <nav className={styles.navbar} style={{backgroundColor: color}}>
            <div onClick={()=> window.location.href = '/'}>
                THEBOOKSTORE
            </div>
            {
              isLoggedIn ? (
                <div style={{float: 'right'}} onClick={()=> window.location.href = '/cart'}>
                                CART({cartNumber})
                </div>
              ) : (
                <div style={{float: 'right'}} onClick={()=> window.location.href = '/login'}>
                                LOGIN
                </div>
              )
            }
            
        </nav>
    </>
  )
}
