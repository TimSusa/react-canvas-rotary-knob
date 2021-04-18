import { useState } from "react";
import "./App.css";
//import RotaryKnob from "./RotaryKnob";
import RotKnob from "./RotKnob";

function App() {
  const [width, setWidth] = useState(250);
  const [max, setMax] = useState(127);
  const [min, setMin] = useState(27);
  const [lineWidth, setlineWidth] = useState(200);
  const [bgColor, setBgColor] = useState("#eee");
  return (
    <div className="App">
      <h2>Canvas Rotary Knob</h2>

      <div className="flex-wrap">
        <RotKnob
          value={50}
          readOnly={false}
          onChange={(e: any) => console.log(e)}
        >{}
        </RotKnob>
        <div className="flex-left">
          <label>width:</label>
          <input
            name="size"
            type="range"
            min={30}
            max={600}
            onChange={onWidthChange}
          >
          </input>
          <label>max:</label>
          <input
            name="max"
            type="input"
            defaultValue={max}
            min={30}
            max={600}
            onChange={onMaxChange}
          >
          </input>

          <label>min:</label>
          <input
            name="min"
            type="input"
            defaultValue={min}
            min={30}
            max={600}
            onChange={onMinChange}
          >
          </input>

          <label>line width:</label>
          <input
            name="line-width"
            type="range"
            defaultValue={min}
            min={10}
            max={90}
            onChange={onLineWidthChange}
          >
          </input>

          <label>background Color:</label>
          <input
            name="b-color"
            type="text"
            defaultValue={bgColor}
            onChange={onBgColorChange}
          >
          </input>
        </div>

        <div className="flex-right">
          {/* <RotaryKnob
            width={width}
            max={max}
            min={min}
            lineWidth={lineWidth}
            backgroundColor={bgColor}
          >
          </RotaryKnob> */}
        </div>
      </div>
    </div>
  );
  function onWidthChange(e: any) {
    setWidth(e.target.value);
  }
  function onMaxChange(e: any) {
    setMax(e.target.value);
  }
  function onMinChange(e: any) {
    setMin(e.target.value);
  }
  function onLineWidthChange(e: any) {
    setlineWidth(e.target.value);
  }
  function onBgColorChange(e: any) {
    setBgColor(e.target.value);
  }
}

export default App;
