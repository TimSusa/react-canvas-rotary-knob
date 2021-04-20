import { useState } from "react";
import "./App.css";
import RotaryKnob from "./RotaryKnob";


function App() {
  const [width, setWidth] = useState(250);
  const [max, setMax] = useState(127);
  const [min, setMin] = useState(27);
  const [lineWidth, setlineWidth] = useState(10);
  const [bgColor, setBgColor] = useState("#eee")
  const [caretColor, setCaretColor] = useState("#fff")
  const [caretWidth, setCaretWidth] = useState(35)
  return (
    <div className="App">
      <h2>Canvas Rotary Knob Configurator</h2>

      <div className="flex-wrap">
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
            defaultValue={lineWidth}
            min={1}
            max={10}
            onChange={onLineWidthChange}
          >
          </input>
          <label>caret width:</label>
          <input
            name="caret-width"
            type="range"
            defaultValue={caretWidth}
            min={15}
            max={100}
            onChange={onCaretWidthChange}
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
        
          <label>caret Color:</label>
          <input
            name="c-color"
            type="text"
            defaultValue={caretColor}

            onChange={onCaretColorChange}
          >
          </input>
        </div>

        <div className="flex-right">
          <RotaryKnob 
          width={width} 
          max={max} 
          min={min} 
          lineWidth={lineWidth} 
          backgroundColor={bgColor} 
          caretColor={caretColor}
          caretWidth={caretWidth}
          ></RotaryKnob>
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
  function onLineWidthChange(e: any){
    setlineWidth(e.target.value)
  }
  function onCaretWidthChange(e: any){
    setCaretWidth(e.target.value)
  }
  function onBgColorChange (e: any) {
    setBgColor(e.target.value)
  }
  function onCaretColorChange(e: any){
    setCaretColor(e.target.value)
  }
}

export default App;
