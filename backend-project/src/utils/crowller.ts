//ts 引用需透過 .d.ts 翻譯文件(@types) js
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

// 組合設計模式

class Crowller {
  private filePath = path.resolve(__dirname, '../../data/course.json')
  
  async getRawHtml() { //拿html內容
    const result = await superagent.get(this.url)
    return result.text;
  }

  writeContent (content: string) { //存儲
    fs.writeFileSync(this.filePath, content)
  }

  async initSpiderProcess () {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeContent(fileContent) 
  }

  constructor (private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess()
  }
}

export default Crowller