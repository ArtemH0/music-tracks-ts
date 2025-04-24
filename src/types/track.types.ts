export interface Track {
	id: string;
	title: string;
	artist: string;
	album: string;
	duration: number;
	coverUrl: string;
	genres: string[];
	audioFile?: string;
	createdAt?: string;
}

export interface TrackFormData {
	title: string;
	artist: string;
	album: string;
	genres: string[];
	coverImage: string;
	duration?: number;
}

export interface Playlist {
	id: string;
	name: string;
	tracks: Track[];
}

export interface PaginationParams {
	page: number;
	limit: number;
	sort?: string;
	order?: "asc" | "desc";
	artist?: string;
	genre?: string;
	search?: string;
}

export interface PaginationMeta extends PaginationParams {
	totalPages: number;
}

export interface TrackListProps {
	tracks: Track[];
	paginationMeta: PaginationMeta;
	loading: boolean;
	error: string | null;
	onEdit: (track: Track) => void;
	onDelete: (track: Track) => void;
	onUpload: (track: Track, file: File) => void;
	onRemoveFile: (track: Track) => void;
	fetchTracks: (params: PaginationParams) => void;
	onPageChange: (page: number) => void;
}

export type PlayerState = {
	currentTrack: Track | null;
	playlist: Playlist | null;
	isPlaying: boolean;
	volume: number;
	currentTime: number;
	duration: number;
};

export type PlayerActions = {
	playTrack: (track: Track, playlist?: Playlist) => void;
	togglePlay: () => void;
	setVolume: (volume: number) => void;
	setCurrentTime: (time: number) => void;
	playNext: () => void;
	playPrevious: () => void;
	addToPlaylist: (track: Track) => void;
	removeFromPlaylist: (trackId: string) => void;
	createPlaylist: (name: string) => void;
};
