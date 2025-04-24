import tracksApi from "../api/tracksApi";
import { PaginationMeta } from "../types/track.types";

export const uploadAudio = async (
	trackId: string,
	file: File,
	fetchTracks: (params?: Partial<PaginationMeta>) => Promise<void>,
	paginationMeta: PaginationMeta
) => {
	const updatedTrack = await tracksApi.uploadAudio(trackId, file);
	fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
	return updatedTrack;
};

export const removeAudio = async (
	trackId: string,
	fetchTracks: (params?: Partial<PaginationMeta>) => Promise<void>,
	paginationMeta: PaginationMeta
) => {
	const updatedTrack = await tracksApi.removeAudio(trackId);
	fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
	return updatedTrack;
};
