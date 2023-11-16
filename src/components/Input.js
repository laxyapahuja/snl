import styles from '@/styles/Input.module.css'

export default function Input({value, placeholder, onChange, textarea=false, type='text'}) {

  return (
    <>
        {
            textarea ? (
                <textarea className={styles.input} placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{height: '7.5rem', padding: '0.625rem'}}/>
            ) : (
                <input className={styles.input} placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)}/>
            )
        }
    </>
  )
}
