export default (req, res) => {
  const refresh_token = req.query.refresh_token || "";

  const data = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const base64data = Buffer.from(data).toString("base64");

  return fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        return res.status(res.status).send(res.statusText);
      }
      return res.json();
    })
    .then((data) =>
      res.status(200).json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
    )
    .catch((err) => res.status(400).send("Error requesting new token"));
};
