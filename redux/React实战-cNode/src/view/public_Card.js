import React, {Component} from "react";
import {Card} from "antd";
export default class PublicCard extends Component {
    render(){
        let {data} = this.props;
        return (<div className="wrap">
            {data.map((item,index)=>(<Card
                title={item.title}
                type="inner"
                key={index}
            >
                <div
                    dangerouslySetInnerHTML={{
                        __html: item.content
                    }}
                >
                </div>
            </Card>))}
        </div>);
    }
}