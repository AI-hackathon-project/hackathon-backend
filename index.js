import express from "express";


const app = express();
const PORT = 8080;

app.use(express.json());

// app.use((req, res) => res.redirect('/api-docs/'));

//Listen for incoming request
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});