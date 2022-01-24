/** @format */

import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import greenTick from "./img/success.png";

import "./App.css";

const App = () => {
	const sketch = useRef();
	const [send, setSend] = useState(false);
	const [prediction, setPrediction] = useState("");
	const [open, setOpen] = React.useState(false);

	const handleSubmit = () => {
		const canvas = sketch.current.getDataURL();
		sendData(canvas);
	};

	const handleClear = () => {
		sketch.current.eraseAll();
		setPrediction("");
		setSend(false);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const sendData = (d) => {
		const formData = new FormData();
		// const URL = "https://hand-digit-classification.herokuapp.com/upload";
		const URL = "http://192.168.0.127:5000/upload";

		formData.append("file", d);

		axios.post(URL, formData).then((res) => {
			console.log(res.data);
			setPrediction(res.data["prediction"]);
			setSend(true);
			handleClickOpen();
		});
	};

	return (
		<div className="App">
			{send && (
				<Dialog open={open} onClose={handleClose}>
					<DialogContent>
						<div className="inner_alert">
							<img
								className="alert_green_tick_img"
								src={greenTick}
								alt="success img"
							/>
							<h3 className="alert_heading">
								Image send to classification successfully.
							</h3>
							<p className="alert_prediction">
								Image classified as : {prediction}
							</p>
							<button className="my_button alert_btn" onClick={handleClose}>
								Close
							</button>
						</div>
					</DialogContent>
				</Dialog>
			)}
			<h2 className="heading">Draw 0 to 9 number</h2>

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
				brushRadius={22}
				hideGrid={true}
				lazyRadius={0}
				immediateLoading={true}
			/>

			{send && sketch.current.eraseAll()}

			<div className="btn_group_div ">
				<button className="my_button" onClick={handleSubmit}>
					Predict
				</button>
				<button className="my_button" onClick={handleClear}>
					Clear
				</button>
			</div>
		</div>
	);
};

export default App;
