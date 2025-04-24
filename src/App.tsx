import CreateTrackModal from "./components/Modal/CreateTrackModal";
import EditTrackModal from "./components/Modal/EditTrackModal";
import TrackList from "./components/TrackList/TrackList";
import tracksApi from "./api/tracksApi";
import { useTracks } from "./hooks/useTracks";
import { useModals } from "./hooks/useModals";
import { useTrackActions } from "./hooks/useTrackActions";
import "./App.css";
import type {
	Track,
	TrackFormData,
	PaginationParams,
} from "./types/track.types";

export default function App() {
	const {
		tracks,
		error,
		paginationMeta,
		fetchTracks,
		handlePageChange,
		addTrack,
		updateTrack,
		deleteTrack,
		loading,
	} = useTracks();

	const { modalOpen, setModalOpen, editTrack, setEditTrack } = useModals();

	const [, playerActions] = useTrackActions({
		currentTrack: null,
		playlist: null,
		isPlaying: false,
		volume: 50,
		currentTime: 0,
		duration: 0,
	});

	const handleSaveTrack = (data: TrackFormData) => {
		const newTrack: Track = {
			id: Date.now().toString(),
			title: data.title,
			artist: data.artist,
			album: data.album,
			duration: data.duration || 0,
			coverUrl: data.coverImage,
			genres: data.genres || [],
		};
		addTrack(newTrack).then(() => {
			playerActions.addToPlaylist(newTrack);
			fetchTracks({ page: 1, limit: paginationMeta.limit });
		});
	};

	const handleDeleteTrack = (track: Track) => {
		deleteTrack(track.id).then(() => {
			playerActions.removeFromPlaylist(track.id);
			fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
		});
	};

	const handleUploadFile = async (track: Track, file: File) => {
		try {
			const updatedTrack = await tracksApi.uploadAudio(track.id, file);
			playerActions.addToPlaylist(updatedTrack);
			fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
		} catch (error) {
			console.error("Error uploading audio:", error);
		}
	};

	const handleRemoveFile = async (track: Track) => {
		try {
			const updatedTrack = await tracksApi.removeAudio(track.id);
			playerActions.addToPlaylist(updatedTrack);
			fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
		} catch (error) {
			console.error("Error removing audio:", error);
		}
	};

	const handleFetchTracks = (params: PaginationParams) => {
		fetchTracks(params);
	};

	return (
		<div className="app">
			<div className="track-list-wrapper">
				<button
					type="button"
					className="blue-button"
					onClick={() => setModalOpen(true)}
				>
					Create Track
				</button>

				{error && <div className="error-message">Помилка: {error}</div>}

				<TrackList
					tracks={tracks}
					paginationMeta={paginationMeta}
					loading={loading}
					error={error}
					onEdit={(track) => {
						const found = tracks.find((t) => t.id === track.id);
						if (found) {
							setEditTrack(found);
						} else {
							setEditTrack({
								...track,
								duration: track.duration ?? 0,
								coverUrl: (track as Track).coverUrl ?? "",
								genres: track.genres ?? [],
							});
						}
					}}
					onDelete={(track) => {
						const found = tracks.find((t) => t.id === track.id);
						if (found) {
							handleDeleteTrack(found);
						} else {
							handleDeleteTrack({
								...track,
								duration: track.duration ?? 0,
								coverUrl: (track as Track).coverUrl ?? "",
								genres: track.genres ?? [],
							});
						}
					}}
					onUpload={(track, file) => {
						const found = tracks.find((t) => t.id === track.id);
						if (found) {
							handleUploadFile(found, file);
						} else {
							handleUploadFile(
								{
									...track,
									duration: track.duration ?? 0,
									coverUrl: (track as Track).coverUrl ?? "",
									genres: track.genres ?? [],
								},
								file
							);
						}
					}}
					onRemoveFile={(track) => {
						const found = tracks.find((t) => t.id === track.id);
						if (found) {
							handleRemoveFile(found);
						} else {
							handleRemoveFile({
								...track,
								duration: track.duration ?? 0,
								coverUrl: (track as Track).coverUrl ?? "",
								genres: track.genres ?? [],
							});
						}
					}}
					fetchTracks={handleFetchTracks}
					onPageChange={handlePageChange}
				/>

				<EditTrackModal
					isOpen={!!editTrack}
					onRequestClose={() => setEditTrack(null)}
					track={editTrack}
					onSave={(updatedData) => {
						const found = tracks.find((t) => t.id === updatedData.id);
						if (found) {
							// Only send mutable fields to updateTrack
							const updatePayload = { ...updatedData };
							updateTrack(updatedData.id, updatePayload).then(() => {
								fetchTracks({ page: paginationMeta.page, limit: paginationMeta.limit });
							});
						}
					}}
				/>

				<CreateTrackModal
					isOpen={modalOpen}
					onRequestClose={() => setModalOpen(false)}
					onSave={handleSaveTrack}
				/>
			</div>
		</div>
	);
}
