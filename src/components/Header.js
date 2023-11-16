import styles from '@/styles/Header.module.css'

export default function Navbar({color, heading}) {
  return (
    <>
        <div className={styles.header} style={{backgroundColor: color}}>
            <h1>
                {heading}
            </h1>
        </div>
    </>
  )
}
