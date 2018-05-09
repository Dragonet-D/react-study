import React, {Component} from "react";
import {Row, Col,Pagination} from "antd";
import IndexMenu from "./indexMenu";
import IndexList from "./list";
class Index extends Component {
    render(){
        let tab = this.props.match.params.id;
        return (
            <Row className="wrap">
                <Col md={6} xs={0} className="indexSider">
                    <IndexMenu
                        id="indexMenu"
                        mode = "vertical"
                    />
                </Col>
                <Col md={0} xs={24}>
                    <IndexMenu
                        id="indexXsMenu"
                        mode="horizontal"
                    />
                </Col>
                <Col
                    md={18}
                    xs={24}
                    className="indexList"
                >
                    <IndexList
                        tab = {tab}
                    />
                </Col>
            </Row>
        );
    }
}

export default Index;