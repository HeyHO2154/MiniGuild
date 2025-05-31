import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 정적 파일 제공 (상위 디렉토리까지)
app.use(express.static(path.join(__dirname, '../')));

// index.html 라우팅 (상위 디렉토리의 index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000);