import fs from 'fs';
import path from 'path';
import {Request, Response, NextFunction} from 'express'
import 'reflect-metadata';
import {controller, use, get} from '../decorator';
import {getResponseData} from '../utils/utils';
import Crowller from '../utils/crowller'
import Analyzer from '../utils/Analyzer';


interface BodyRequest extends Request {
  body: {[key: string]: string | undefined;};
}

interface MovieItems {
  title: string;
  comeDay: string;
  boxOffice: number;
}

interface DataStructure {
  [key: string]: MovieItems[];
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false)
  if (isLogin) {
    next();
    console.log(123);
  } else {
    res.json(getResponseData(null, '請先登入'))
  }
}

const test = (req: Request, res: Response, next: NextFunction): void => {
  next();
  console.log(456);
}

@controller('/api')
export class CrowllerController {
  @get('/getData')
  @use(checkLogin)
  @use(test)
  getData (req: BodyRequest, res: Response): void {
    const url = `https://srm.com.tw/`
    const analyzer = new Analyzer()
    new Crowller(url, analyzer)
    res.json(getResponseData<responseResult.getData>(true))
  }

  @get('/showData')
  @use(checkLogin)
  showData (req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json')
      const result = fs.readFileSync(position,'utf8')
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)))
    } catch (error) {
      res.json(getResponseData<responseResult.showData>(false, '數據不存在'))
    }
  }
}