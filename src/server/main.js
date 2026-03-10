import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.use(express.json());

app.post("/testsubmit", async (req, res) => {
  res.ok=true;
  const code = req.body.code;
  res.send({"run-result":code+" is what I received!"});
});


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
