const express = require('express');
const path = require('path');
const port = 3000;

const app = express();

app.use("/static", express.static("static-assets"));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("signIn.html"));
});

app.get("/teacherp/:x", (req,res)=>{
    res.sendFile(path.resolve("teacherp.html"));
});

app.get("/personal/:x", (req,res)=>{
    res.sendFile(path.resolve("personal.html"));
});

app.get("/add/:x", (req,res)=>{
    res.sendFile(path.resolve("add_student.html"));
});

app.get("/test/:x", (req,res)=>{
    res.sendFile(path.resolve("test.html"));
});

app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`server running on http://localhost:${port}`));