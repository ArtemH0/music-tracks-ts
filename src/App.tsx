import React from "react";
import { TrackProvider } from "./context/TrackContext";
import TrackManager from "./context/TrackManager";
import "./App.css";

const App: React.FC = () => {
	return (
		<div className="app">
			<TrackProvider>
				<TrackManager />
			</TrackProvider>
		</div>
	);
};

export default App;
