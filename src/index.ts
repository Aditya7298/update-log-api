import * as dotenv from "dotenv";
dotenv.config();

import app from "./server";

app.listen(8080, () => {
  console.log("Listening on post 8080");
});
