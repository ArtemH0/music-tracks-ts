import React, { useState } from "react";
import { TrackContext } from "./TrackContext";
import { useTracks } from "../hooks/useTracks";
import { uploadAudio, removeAudio } from "../utils/trackUtils";
import type { Track } from "../types/track.types";

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		tracks,
		loading,
		error,
		paginationMeta,
		fetchTracks,
		addTrack,
		updateTrack,
		deleteTrack,
	} = useTracks();

	const [editTrack, setEditTrack] = useState<Track | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const value = {
		tracks,
		loading,
		error,
		paginationMeta,
		fetchTracks,
		addTrack,
		updateTrack,
		deleteTrack,
		uploadAudio: (trackId: string, file: File) =>
			uploadAudio(trackId, file, fetchTracks, paginationMeta),
		removeAudio: (trackId: string) =>
			removeAudio(trackId, fetchTracks, paginationMeta),
		editTrack,
		setEditTrack,
		modalOpen,
		setModalOpen,
	};

	return (
		<TrackContext.Provider value={value}>{children}</TrackContext.Provider>
	);
};
