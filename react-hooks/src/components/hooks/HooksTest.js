import React, {useState, useEffect} from "react";
import {Button} from "antd";

export class HooksTest1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "aaa"
    }
  }

  componentWillMount() {
    console.log("Component Will Mount");
  }

  handleTest = () => {
    this.setState({
      test: "change"
    })
  };

  render() {
    return (
        <div>
          {this.state.test}
          <Button onClick={this.handleTest}>handleTest</Button>
        </div>
    )
  }
}

function HooksTest(props) {

  const [test, setTest] = useState("aaa");

  useEffect(() => {
    console.log("Component Will Mount");
  }, []);

  useEffect(() => {
    console.log("always update");
  });
  function handleTest() {
    setTest(Math.random())
  }

  return (
      <div>
        <div>{test}</div>
        <Button onClick={handleTest}>setTest</Button>
      </div>
  )
}

export default HooksTest;
