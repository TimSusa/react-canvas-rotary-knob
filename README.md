# React Canvas Rotary Knob
- Fully customizable Rotary Knob
- Powered with HTML Canvas

<p align="center">
  <img width="250" src="./docs/sc1.png">
</p>

## Live Knob Configurator
[Live Web Demo](https://react-canvas-rotary-knob-timsusa.vercel.app) 
<p align="center">
  <img width="250" src="./docs/sc2.png">
</p>

## Get Started

This project consists of one configuration application as test environment and one build for the lib. Consider the .tsx file can be used in the deno world, aswell. 

## Build the library
```
npm run build-lib
``` 


However, in the project directory, you can run:

### Component Interface
  - isDisabled: bool, default Value = false,
  - width: number: , default Value = 160,
  - height: number: , default Value = 160,
  - value: number, default Value = 80,
  - max: number, default Value = 127,
  - min: number, default Value = 0,
  - backgroundColor: string, default Value = "#ccc",
  - cbValChanged: function, default Value = (val: number): , default Value => val,
  - color: object, default Value = "#37332ee0",
  - showValueLabel: bool, default Value = true,
  - debounceDelay: number, default Value = 5,
  - lineWidth: number, default Value = 40,


### Build the Library
```
npm run build-lib
```  
Builds the library for production to the `lib` folder.\

#### Usage in a NodeJS Project
You could make use of the result via linking this github repo to your package.json. See an example here:

[Example on how to include to node project ](https://github.com/TimSusa/midi-bricks/blob/master/package.json#L74) for more information.

#### Usage in a Deno Project
See an example here:

[Example on how to include to deno project ](https://github.com/TimSusa/aleph-example/blob/master/pages/index.tsx#L3) for more information.


### Testing

As far as tests are in the project, these could be started via:
``` 
npm run test
``` 

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Configuration Application
### Start Application

```
npm run start
```  
Runs the wrapper app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Build the Application
```
npm run build
```  
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
