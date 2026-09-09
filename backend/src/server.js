const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6767;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
	console.log("[debug: works");
	res.json({
		debug: "hello, world!"
	});
});



app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
