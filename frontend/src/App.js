/** @format */

import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { Alert, Button } from "react-bootstrap";
import axios from "axios";

import "./App.css";

const App = () => {
	const sketch = useRef();
	const [send, setSend] = useState(false);
	const [prediction, setPrediction] = useState("");

	const handleSubmit = () => {
		const canvas = sketch.current.getDataURL();
		sendData(canvas);
	};

	const handleClear = () => {
		sketch.current.eraseAll();
		setPrediction("");
		setSend(false);
	};

	const sendData = (d) => {
		const formData = new FormData();
		const URL = "https://hand-digit-classification.herokuapp.com/upload";

		formData.append("file", d);

		axios.post(URL, formData).then((res) => {
			console.log(res.data);
			setPrediction(res.data["prediction"]);
			setSend(true);
		});
	};
	return (
		<div className="App">
			{send && (
				<Alert className="alert" variant="info">
					Image successfully send to classification
				</Alert>
			)}
			<h2 className="number_heading">Draw 0 to 9 number</h2>

			<CanvasDraw
				className="canvas"
				ref={sketch}
				style={{
					boxShadow:
						"0 13px 27px -5px rgba(50, 50, 93, 0.25),    0 8px 16px -8px rgba(0, 0, 0, 0.3)",
				}}
				canvasWidth={500}
				canvasHeight={500}
				brushColor="white"
				backgroundColor="black"
				brushRadius={30}
				hideGrid={true}
			/>

			<div className="btn_group_div">
				<Button className="btn_predict" onClick={handleSubmit}>
					Predict
				</Button>
				<Button className="btn_clear" onClick={handleClear}>
					Clear
				</Button>
			</div>
			{send && <div className="prediction_div">Prediction : {prediction}</div>}
		</div>
	);
};

export default App;
