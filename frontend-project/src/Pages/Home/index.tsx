import React, {Component}from 'react';
import styled from 'styled-components'
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import request from '../../request';
import moment from 'moment';
import './style.css'

// interface State {
//   isLogin: boolean;
// }

interface State {
  loaded: boolean;
  isLogin: boolean;
  data: responseResult.DataStructure
}


class Home extends Component {
  // constructor (props: ) {
  //   super(props);
  //   this.state = {
  //     isLogin: true,
  //   }
  // }

  state: State = {
    loaded: false,
    isLogin: true,
    data: {}
  }

  componentDidMount() {
    request.get('/api/isLogin').then((res)=> {
      const data: responseResult.isLogin = res.data
      if (!data) {
        this.setState({
          isLogin: false,
          loaded:true
        })
      } else {
        this.setState({
          loaded: true
        })
      }
    })

    request.get('/api/showData').then((res)=> {
      const data: responseResult.DataStructure = res.data
      if (data) {
        this.setState({data})
      }
    })
  }

  handleLogoutClick = (e: React.MouseEvent) => {
    request.get('/api/logout').then((res)=> {
      const data: responseResult.logout = res.data
      if (data) {
        this.setState({
          isLogin: false
        })
      }
    })
  }

  handleCrowllerClick () {
    request.get('/api/getData').then((res)=> {
      const data: responseResult.getData = res.data
      if (data) {
        message.success('爬取成功')
      }
    })
  }

  getOption () :echarts.EChartOption {
    const { data } = this.state
    let movieNames: string[] = []
    let times: string[] = []
    const tempData: {
      [key: string]: number[];
    } = {}
    console.log(data);

    for(let i in data) {
      const item = data[i]
      times.push(moment(Number(i)).format('MM-DD HH:mm'));
      item.forEach(innerItem => {
        const { title, boxOffice } = innerItem
        if (movieNames.indexOf(title) === -1) {
          movieNames.push(title)
        }
        tempData[title] ? tempData[title].push(boxOffice) : (tempData[title] = [boxOffice])
      })
    }    
    const result: echarts.EChartOption.Series[] = []
    for (let i in tempData) {
      result.push({
        name: i,
        type: 'line',
        data: tempData[i]
      })
    }
    console.log(data);
    return {
      // title: {
      //     text: '電影觀看人數折線圖'
      // },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: movieNames
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: times
      },
      yAxis: {
          type: 'value'
      },
      series: result
    };
  }

  render () {
    const {isLogin, loaded} = this.state;
    
    if (isLogin) {
      if (loaded) {
        return (
          <div className="home-page">
            <div className="buttons">
            <Button 
              style={{marginRight: '25px'}}
              onClick={this.handleCrowllerClick}>爬取</Button>
            <Button onClick={this.handleLogoutClick}>退出</Button>
            </div>
            <div className="chart">
              <ReactEcharts option={this.getOption()} />
            </div>
          </div>
        )
      } else {
        return null
      }
    } 
    return <Redirect to="/login"/>
    
  }
}

export default Home