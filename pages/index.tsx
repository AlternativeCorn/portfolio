import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Mia Bouman - A Developer</title>
        <meta name="description" content="Your friendly neighbourhood full stack dev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.hero}>
          <h1>Hi I&apos;m <span className={styles.name}>Mia</span></h1>
          <h2>I make <span className={styles.things}>things</span></h2>
        </div>
        <Link href="/contact"><div className={styles.contactbutton}>Contact Me</div></Link>
        <a href="https://github.com/AlternativeCorn/portfolio"><div className={styles.contactbutton} style={{backgroundColor: 'var(--color-secondary)', color: "#fff"}}>Source Code</div></a>
        <div className={styles.projects}>
          <a href="https://miobot.gg">
            <div className={styles.project}>
              <h1>MioBot</h1>
              <img alt="Mio Mascot" src="/img/mio.png" />
            </div>
          </a>
          <a href="https://github.com/AlternativeCorn">
            <div className={styles.project}>
              <h1>On GitHub</h1>
              <img alt="Github Profile Picture" src="/img/github.png" />
            </div>
          </a>
        </div>
      </main>
    </div>
  )
}

export default Home
