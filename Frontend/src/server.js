const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 제공 (상위 디렉토리까지)
app.use(express.static(path.join(__dirname, '../')));

// index.html 라우팅 (상위 디렉토리의 index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(3000);