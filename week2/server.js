import fs from 'fs' 
import express from 'express';
import os from 'os';



const app = express();
app.use(express.json());

app.get('/', (req, res)=>{
    fs.readFile('index.html', 'utf8', (err, data)=>{
        if (err){
            res.writeHead(500, {'Content-Type': 'text/plain'});//직접 content type 설정
            console.log('get error:', err);
            res.end('Error');
        } else{
            res.writeHead(200, {'Content-Type':'text/html'}); //응답 헤더에 대한 정보 기록. 콘텐츠 형식 등.
            res.end(data);
        }
    })
});

app.post('/api/signup', (req, res)=>{
    // 회원가입 처리
    const {username, password, email} = req.body;
    if (!username || !password || !email){
        return res.status(400).send('모든 필드를 입력해주세요.');
    }
    const newuser ={
        username: username,
        password: password,
        email: email
    }
    const filePath='./data/users.json';
    fs.readFile(filePath, 'utf8', (err, data)=>{
        let users = [];
        if (err){
            console.error('파일 읽기 오류:', err);
            return res.status(500).send('서버 오류');
        }
        if (!err && data){
            try {
                users = JSON.parse(data);
            } catch (parseErr){
                console.error('JSON 파싱 오류:', parseErr);
            }
        }
        const isDuplicate = users.some(user => user.username === username);
        if (isDuplicate){
            return res.status(409).send('이미 존재하는 사용자입니다.');
        }
        users.push(newuser);
        fs.writeFile(filePath, JSON.stringify(users), (err)=>{
            if (err){
                console.error('파일 쓰기 오류:', err);
                return res.status(500).send('서버 오류');
            }
            res.status(201).send('회원가입 성공');
        });
    });
});

//로그인
app.post('/api/login', (req, res)=>{
    const {username, password}=req.body;
    if (!username || !password){
        return res.status(400).send('모든 필드를 입력해주세요!');
    }
    const filePath='./data/users.json';
    fs.readFile(filePath, 'utf8', (err, data)=>{
        if (err){
            console.error('파일 읽기에서 오류', err);
            return res.status(500).send('서버오류');
        }
        let users =[];
        if (data){
            try {
                users = JSON.parse(data);
            } catch (parseErr){
                console.error('JSON 파싱 오류:', parseErr);
            }
        }
        const user = users.find(user => user.username === username && user.password === password);
        if (!user){
            return res.status(401).send('잘못된 사용자 이름 또는 비밀번호');
        }
        res.status(200).send('로그인 성공');
    })
});

//사용자 정보 읽어서 반환
app.get('/api/users', (req, res)=>{
    const filePath='./data/users.json';
    fs.readFile(filePath, 'utf8', (err, data)=>{
        if (err){
            console.error('파일 읽기 오류:', err);
            return res.status(500).send('서버 오류');
        }
        let users = [];
        if (data){
            try {
                users = JSON.parse(data);
            } catch (parseErr){
                console.error('JSON 파싱 오류:', parseErr);
            }
        }
        res.status(200).json(users);
    })

})

//os 정보 반환. type, hostname, cpu_num, total_mem
app.get('/api/os', (req, res)=>{
    const osInfo = {
        type: os.platform(),
        hostname: os.homedir(),
        cpu_num: os.cpus().length,
        total_mem: os.totalmem()
    }
    res.status(200).json(osInfo);
})
            
        
app.listen(3000, ()=>{
    console.log('서버 실행중.... http://localhost:3000');
})