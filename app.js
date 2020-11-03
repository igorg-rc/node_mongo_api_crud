import express from 'express';
import morgan from 'morgan';
import StudentRoute from './routes/studentsRoute';
import students from './data/students.json';
import bodyParser from 'body-parser';
import path from 'path';
import https from 'https';
import fs from 'fs';

const tlsOptions = {
  key: fs.readFileSync(path.join('key.pem')),
  cert: fs.readFileSync(path.join('cert.pem')),
  passphrase: 'igor_1987'
};

const buildUrl = (version, path) => `/api/${version}/${path}`;
const STUDENTS_BASE_URL = buildUrl('v1', 'students');

const server = express();
const PORT = 3000;
const TLS_PORT = 3003;

server.use(morgan('tiny'));
server.use(bodyParser.json());
server.use('/staticfiles', express.static('public'));

server.set('views', path.join('views'));
server.set('view engine', 'ejs');

server.use(STUDENTS_BASE_URL, StudentRoute);

server.get('/', (req, res) => {
  res.render('index', {
    students
  });
});

server.get('/download/images/:imageName', (req, res) => {
  res.download(path.join('public', 'images', req.params.imageName));
});


server.get('/route-handlers', (req, res, next) => {
  res.send("Learning of handling");
  next();
}, (req, res, next) => {
  console.log("second handler");
  next();
}, (req, res) => {
  console.log("third handler");
});


server.listen(PORT, () => {
  console.log(`Server started at localhost: ${PORT}...`);
});

https.createServer(tlsOptions, server).listen(TLS_PORT, () => {
  console.log(`HTTPS server started at localhost: ${TLS_PORT}...`);
});