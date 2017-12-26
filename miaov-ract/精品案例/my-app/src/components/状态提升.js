import React, {Component} from 'react'

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>水会烧开</p>
  }
  return <p>水不会烧开</p>
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.handleChane = this.handleChane.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState(
      {
        temperature: e.target.value
      }
    )
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>输入一个摄氏温度</legend>
        <input
          value={temperature}
          onChange={this.handleChane}
        />
        <BoilingVerdict
          celsius={parseFloat(temperature)}
        />
      </fieldset>
    )
  }
}

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32
}

class TemperatureInput extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({
      temperature: e.target.value
    })
  }

  render() {
    const temperature = this.state.temperature
  }
}

class Calculator extends Component {
  constructor(props) {
    super(props)
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange}
        />
        <TemperatureInput
          scle="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange}
        />
        <BoilingVerdict
          celsius={parseFloat(celsius)}
        />
      </div>
    )
  }
}




























