import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header'
import Main from './main'
import Footer from './footer'

/*
* header
* main
* footer
*
* */

/*
*
* [
* {
*   title: '空白格',
*   singer: '周杰伦',
*   selected: false,
*   like: false
* }
* ]
*
* */
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          title: '空白格',
          singer: '蔡健雅',
          selected: false,
          like: false
        },
        {
          title: '空白格222',
          singer: '蔡健雅222',
          selected: true,
          like: false
        },
        {
          title: '空白格333',
          singer: '蔡健雅333',
          selected: false,
          like: true
        }
      ]
    }
  }

  render() {
    return (
      <div id="musicApp">
        <Header/>
        <Main
          data={this.state.data}
        />
        <Footer/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
