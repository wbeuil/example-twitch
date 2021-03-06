import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const refreshToken = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    return fetch(`/api/token?refresh_token=${refreshToken}`)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      })
      .catch((err) => setError(err));
  };

  const fetchUser = () => {
    const token = localStorage.getItem("access_token");
    return fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.CLIENT_ID,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          return refreshToken();
        }
        return res.json();
      })
      .then((d) => setUser(d.data[0]))
      .catch((err) => setError(err));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Next.js!</h1>

        <a
          href={`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=user:read:email&redirect_uri=${process.env.REDIRECT_URI}`}
        >
          Connect to Twitch
        </a>

        <button onClick={fetchUser}>Fetch User</button>

        {user && !error && <p>{user.login}</p>}
        {error && <p>{error}</p>}
      </main>
    </div>
  );
}
