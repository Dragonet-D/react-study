import React, {Component} from 'react';
import Hooks from "./Components/Hooks/Hooks";
import _ from "lodash";
import './App.css';

class App extends Component {
    state = {
        content: "hello immutable"
    };
    test = () => {
        this.setState({
            content: "hello word"
        })
    };

    componentDidMount() {
        var c = [
            {
                "capalarm.alarmtype": "Device/Reading"
            },
            {
                "capalarm.state": "unowned"
            },
            {
                "capevent.severity": "2"
            },
            {
                "capevent.severity": "3"
            }
        ];
        var a = [
            {
                "capalarm.alarmtype": "Device/Reading",
                "capalarm.state": "unowned",
                "capevent.severity": "2",
                "count": "32"
            },
            {
                "capalarm.alarmtype": "Device/Reading",
                "capalarm.state": "unowned",
                "capevent.severity": "3",
                "count": "2"
            },
            {
                "capalarm.alarmtype": "Device/Reading1",
                "capalarm.state": "unowned",
                "capevent.severity": "3",
                "count": "2"
            }
        ];
        console.log(this.ff(a, c));
    }

    ff(data, target) {
        let result = [];
        data.forEach(item => {
            target.forEach(itemm => {
                const findOne = _.find([item], itemm);
                if (findOne) {
                    result.push(JSON.stringify(findOne));
                }
            });
        });
        return [...new Set(result)].map(item => JSON.parse(item));
    }

    f(data, target) {
        let result = [];
        let fistIndex = target.length - 1;
        const firstRule = target[fistIndex];
        console.log(data);
        data.forEach(item => {
            const findOne = _.find([item], firstRule);
            console.log(findOne);
            if (findOne) {
                result.push(findOne);
            } else {
                return result;
            }
            if (fistIndex === 0) return result;
        });
        if (target.length === 0) {
            return result;
        } else {
            target.length--;
        }
        return this.f(result, target);
    }

    render() {
        return (
            <div className="App">
                <button onClick={this.test}>test</button>
                <Hooks/>
                <Hooks/>
                <Hooks/>
                <Hooks/>
                <Hooks/>
                <Hooks/>
            </div>
        );
    }
}

export default App;
