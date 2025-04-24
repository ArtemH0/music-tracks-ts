import React, { createContext, useContext, useState } from "react";
import type { Track, PaginationMeta } from "../types/track.types";
import tracksApi from "../api/tracksApi";
import { useTracks } from "../hooks/useTracks";

interface TrackContextType {
	tracks: Track[];
	loading: boolean;
	error: string | null;
	paginationMeta: PaginationMeta;
	fetchTracks: (params?: Partial<PaginationMeta>) => Promise<void>;
	addTrack: (track: Omit<Track, "id">) => Promise<Track>;
	updateTrack: (id: string, track: Partial<Track>) => Promise<Track>;
	deleteTrack: (id: string) => Promise<void>;
	uploadAudio: (trackId: string, file: File) => Promise<Track>;
	removeAudio: (trackId: string) => Promise<Track>;
	editTrack: Track | null;
	setEditTrack: (track: Track | null) => void;
	modalOpen: boolean;
	setModalOpen: (isOpen: boolean) => void;
}

const TrackContext = createContext<TrackContextType | null>(null);

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

	const value = {
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

export const useTrackContext = () => {
	const context = useContext(TrackContext);
	if (!context) {
		throw new Error("useTrackContext must be used within a TrackProvider");
	}
	return context;
};
