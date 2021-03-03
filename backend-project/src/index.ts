import express from 'express';
import cookieSession from 'cookie-session'
import bodyParser from 'body-parser'
import './controller/LoginController'
import './controller/crowllerController'
import router from './router';

// 問題1. express 庫類型定義文件 .d.ts 文件類型並不準確
// 問題2. 當我使用中間鑑時， 對 req 或者 res 做了修改後，時寄類型不能改變

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
  name: 'session',
  keys: ['eddie'],
  maxAge: 24*60*60*1000,
}))
app.use(router);

app.listen(7001,() => {
  console.log('server is running');
})
