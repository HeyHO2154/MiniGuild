const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 제공
app.use(express.static(__dirname));

// index.html 라우팅
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000);