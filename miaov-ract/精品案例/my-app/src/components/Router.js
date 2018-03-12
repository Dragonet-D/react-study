import React, {Component} from 'react';
import {BrowserRouter, Switch, Link, Route, Redirect} from 'react-router-dom';
import Main from './Root';

let data = new Date();
let o = {
  'mmm': data.getMonth() + 1,
}

class Index extends Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route path="/add" render={(e) => {
              return (
                  <Add
                      length={this.state.data.length}
                      add={this.add}
                      router={e}
                  />
              )
            }}/>
            <Route path="/" render={(e) => {
              // 重定向
              if (this.state.data.length === 0) {
                return <Redirect to="/add"/>
              }
              return (
                  <Home
                      pathName={e.location.pathname}
                  />
              );
            }}/>
          </Switch>
        </BrowserRouter>
    );
  }
}

class Home extends Component {
  render() {
    let props = this.props;
    let data = this.state.data;
    let selectData = data.filter((val) => val.selected);
    let likeData = data.filter((value) => value.like);
    return (
        <div>
          <header>
            <h2 className="title">
              {props.pathName === '/' ? "播放" : "收藏"}
              <Link to="/add" className="addLink">添加歌曲</Link>
            </h2>
          </header>
          <Link to="/">所有列表</Link>
          <Link to="/like">收藏列表</Link>
          <Route path="/" exact render={(e) => {
            // 路由对象
            console.log(e);
            return (
                <Main
                    data={props.data}
                    isCheck={props.checkAll}
                />
            );
          }}/>
          <Route path="/like" render={() => {
            // 重定向
            if (likeData.length === 0) {
              return <Redirect to="/add"/>
            }
            return (
                <Main
                    data={likeData}
                    isCheckAll={props.checkAll}
                />
            );
          }}/>
        </div>
    );
  }
}

class Footer extends Component {
  render() {
    let pathName = this.props.pathName;
    return (
        <footer>
          {
            pathName === '/' ? <Link to="/like">查看收藏列表</Link> : ''
          }
          {
            pathName === '/like' ? <Link to="/like">查看所有列表</Link> : ''
          }
        </footer>
    );
  }
}

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  getBack() {
    if (this.props.length > 0) {
      return (
          <a
              className="backLink"
              onClick={() => {
                this.props.router.history.goBack()
              }}
          >返回</a>
      );
    }
  }

  render() {
    console.log(this.props.router);
    return (
        <header>
          <h2 className="title">
            播放列表
            {
              this.getBack()
            }
          </h2>
          <input
              type="button"
              value="添加"
              onClick={() => {
                this.props.router.history.push('/')
              }}/>
        </header>
    );
  }
}

export default Home;