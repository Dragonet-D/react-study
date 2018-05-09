import React, {Component} from "react";
import data from "./data";
import PublicCard from "../public_Card";
class Book extends Component {
    render(){
        return (<PublicCard
            data = {data}
        />);
    }
}

export default Book;