export default (req, res) => {
  const code = req.query.code || "";

  return fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        return res.status(res.status).send(res.statusText);
      }
      return res.json();
    })
    .then((data) =>
      res
        .status(200)
        .json({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        })
    )
    .catch((err) => res.status(400).send("Error authenticating"));
};
