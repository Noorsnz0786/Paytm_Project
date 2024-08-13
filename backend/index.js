const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors"); // Correct import

const app = express();

app.use(express.json());
app.use(cors()); // Correct usage

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("Server is starting at port 3000");
});
