import cheerio from 'cheerio';
import fs from 'fs';
import {Analyzer} from './crowller';

//組合模式


interface course1 {
  title: string;
  comeDay: string;
  boxOffice: number;
}

interface courseResult {
  time: string;
  data: course1[]
}

interface Content {
  [propName: string]: course1[];
}

export default class spiderAnalyzer implements Analyzer {

  private dates = new Date();
  private getCourseInfo (html: string) { //爬蟲爬出電影訊息
    const $ = cheerio.load(html)
    const courseItems = $('.grid-content')
    const courseInfo: course1[] = []
    courseItems.map((index, element) => {
      const title = $(element).find('a').text();
      const comeDay = $(element)
      .find('.grid-entry-excerpt')
      .text()
      .split('：')[1]
      // const title = descs.text()
      const boxOffice = Math.floor(Math.random()*200)+100;
      courseInfo.push({title, comeDay, boxOffice})
    })
    return {
      time: this.dates.getTime().toString(),
      data: courseInfo
    }
  }

  private generateJsonContent (result: courseResult, filePath: string) { //生成存取內容
    let fileContent:Content = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8')) 
    }
    fileContent[result.time] = result.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const result = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(result, filePath) //生成存取內容
    return JSON.stringify(fileContent)
  }
}