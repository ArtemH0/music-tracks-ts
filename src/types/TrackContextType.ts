import type { Track, PaginationMeta } from "./track.types";

export interface TrackContextType {
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
	genres: string[];
}
