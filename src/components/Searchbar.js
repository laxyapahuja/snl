import styles from '@/styles/Searchbar.module.css'
import { useState } from 'react'

export default function Searchbar({onSubmit}) {

  const [query, setQuery] = useState('')

  return (
    <div className={styles.searchDiv}>
      <form action='#' onSubmit={() => {
        onSubmit(query);
        return false
      }}>
        <input type="text" placeholder="Search" className={styles.search} onChange={(e)=>setQuery(e.target.value)}/>
        <button type="submit"><svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.875 16.4602L13.875 12.4554C13.7454 12.3226 13.6012 12.2051 13.445 12.105L12.445 11.4142C14.5019 8.86596 14.521 5.23099 12.491 2.66125C10.461 0.0915127 6.92359 -0.727158 3.9731 0.689914C1.0226 2.10699 -0.553565 5.3816 0.177728 8.5751C0.909021 11.7686 3.75261 14.0287 7.025 14.0173C8.61304 14.0178 10.1541 13.4776 11.395 12.4855L12.145 13.4867C12.234 13.6156 12.3344 13.7362 12.445 13.8471L16.445 17.8519C16.5389 17.9467 16.6667 18 16.8 18C16.9333 18 17.0611 17.9467 17.155 17.8519L17.855 17.1511C18.0448 16.9631 18.0536 16.6589 17.875 16.4602ZM7.025 12.0149C4.26357 12.0149 2.025 9.77362 2.025 7.00887C2.025 4.24411 4.26357 2.00284 7.025 2.00284C9.78642 2.00284 12.025 4.24411 12.025 7.00887C12.025 8.33655 11.4982 9.60985 10.5605 10.5487C9.62285 11.4875 8.35108 12.0149 7.025 12.0149Z" fill="black"/>
        </svg></button>
      </form>
    </div>
  )
}
