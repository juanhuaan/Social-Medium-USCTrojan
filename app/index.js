const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    console.log(path.join(__dirname, 'build', 'index.html'))
    console.log('url: ', req)
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3003);
