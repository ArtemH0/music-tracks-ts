import React, { useState } from "react";
import { TrackContext } from "./TrackContext";
import type { TrackContextType } from "../types/TrackContextType";
import tracksApi from "../api/tracksApi";
import { useTracks } from "../hooks/useTracks";
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

	const uploadAudio = async (trackId: string, file: File) => {
		const updatedTrack = await tracksApi.uploadAudio(trackId, file);
		fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
		return updatedTrack;
	};

	const removeAudio = async (trackId: string) => {
		const updatedTrack = await tracksApi.removeAudio(trackId);
		fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
		return updatedTrack;
	};

	const value: TrackContextType = {
		tracks,
		loading,
		error,
		paginationMeta,
		fetchTracks,
		addTrack,
		updateTrack,
		deleteTrack,
		uploadAudio,
		removeAudio,
		editTrack,
		setEditTrack,
		modalOpen,
		setModalOpen,
	};

	return (
		<TrackContext.Provider value={value}>{children}</TrackContext.Provider>
	);
};
