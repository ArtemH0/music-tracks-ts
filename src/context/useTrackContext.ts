import { useContext } from "react";
import { TrackContext } from "./TrackContext";

export const useTrackContext = () => {
	const context = useContext(TrackContext);
	if (!context) {
		throw new Error("useTrackContext must be used within a TrackProvider");
	}
	return context;
};
