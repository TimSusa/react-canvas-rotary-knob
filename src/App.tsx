import "./App.css";
import RotaryKnob from "./RotaryKnob";

function App() {
  return (
    <div className="App">
      <div>Canvas Rotary Knob</div>
      <RotaryKnob cbValChanged={(e)=> {
        console.log(e)
        return 0
      }}></RotaryKnob>
    </div>
  );
}

export default App;
