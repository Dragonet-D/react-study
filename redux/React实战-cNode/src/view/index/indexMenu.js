import React,{Component} from "react";
import {Link,withRouter} from "react-router-dom";
import {Menu} from "antd";
import tab from "../tab";
class IndexMenu extends Component {
    constructor(arg){
        super(arg);
        let now = this.getNow(this.props.location);
        this.state = {
            now
        }
    }
    getNow(location){
        let now = location.pathname.split("/");
        return now[2];
    }
    shouldComponentUpdate(nextProps){
        let now = this.getNow(nextProps.location);
        if(now !== this.state.now){
            this.setState({
                now
            })
            return false;
        }
        return true;
    }
    render(){
        return (<Menu
            id={this.props.id}
            mode = {this.props.mode}
            selectedKeys={[this.state.now]}
        >
            {tab.map((item)=>{
                if(!item.isIndex){
                    return false;
                }
                return (<Menu.Item key={item.tab}>
                    <Link to={"/index/"+item.tab}>{item.txt}</Link>
                </Menu.Item>)
            })}
        </Menu>);
    }
}
export default withRouter((props)=>{
    let {mode,id,location} = props;
    return <IndexMenu
        mode = {mode}
        id = {id}
        location = {location}
    />;
})