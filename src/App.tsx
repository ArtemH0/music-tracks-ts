import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import CreateTrackModal from "./components/Modal/CreateTrackModal";
import EditTrackModal from "./components/Modal/EditTrackModal";
import TrackList from "./components/TrackList/TrackList";
import "./App.css";
import {
	API_BASE_URL,
	AUDIO_FILE_TYPES,
	DEFAULT_PAGINATION,
	MAX_FILE_SIZE,
} from "./config";

Modal.setAppElement("#root");

interface Track {
	id: string;
	title: string;
	artist: string;
	album?: string;
	genre?: string;
	genres?: string[];
	coverImage?: string;
	audioFile?: string;
	createdAt?: string;
}

interface PaginationMeta {
	page: number;
	limit: number;
	totalPages: number;
}

export default function App() {
	const [modalOpen, setModalOpen] = useState(false);
	const [tracks, setTracks] = useState<Track[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editTrack, setEditTrack] = useState<Track | null>(null);
	const [paginationMeta, setPaginationMeta] =
		useState<PaginationMeta>(DEFAULT_PAGINATION);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	const fetchTracks = useCallback(
		async (params: Record<string, string | number> = {}) => {
			try {
				setLoading(true);
				const response = await axios.get(`${API_BASE_URL}/tracks`, {
					params: {
						page: paginationMeta.page,
						limit: paginationMeta.limit,
						...params,
					},
				});

				setTracks(response.data.data || []);
				setPaginationMeta({
					page: response.data.meta?.page || 1,
					limit: response.data.meta?.limit || 5,
					totalPages: response.data.meta?.totalPages || 1,
				});
				setInitialLoadComplete(true);
			} catch (err: unknown) {
				if (axios.isAxiosError(err)) {
					setError(err.response?.data?.message || err.message);
				} else {
					setError(String(err));
				}
			} finally {
				setLoading(false);
			}
		},
		[paginationMeta.page, paginationMeta.limit]
	);

	useEffect(() => {
		if (!initialLoadComplete) {
			fetchTracks();
		}
	}, [fetchTracks, initialLoadComplete]);

	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => setError(null), 4000);
			return () => clearTimeout(timeout);
		}
	}, [error]);

	const handleSaveTrack = async (trackData: Omit<Track, "id">) => {
		try {
			await axios.post(`${API_BASE_URL}/tracks`, trackData, {
				headers: { "Content-Type": "application/json" },
			});
			fetchTracks();
			setModalOpen(false);
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			} else {
				setError(String(err));
			}
		}
	};

	const handleUpdateTrack = async (updatedTrack: Track) => {
		try {
			await axios.put(
				`${API_BASE_URL}/tracks/${updatedTrack.id}`,
				updatedTrack,
				{ headers: { "Content-Type": "application/json" } }
			);
			fetchTracks();
			setEditTrack(null);
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			} else {
				setError(String(err));
			}
		}
	};

	const handleDeleteTrack = async (track: Track) => {
		if (!window.confirm(`Delete "${track.title}"?`)) return;
		try {
			await axios.delete(`${API_BASE_URL}/tracks/${track.id}`);
			fetchTracks();
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			} else {
				setError(String(err));
			}
		}
	};

	const handleUploadFile = async (track: Track, file: File | null) => {
		if (!file) return;
		if (!AUDIO_FILE_TYPES.includes(file.type)) {
			alert("Only MP3 or WAV files are allowed");
			return;
		}
		if (file.size > MAX_FILE_SIZE) {
			alert("Max file size is 10MB");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			await axios.post(`${API_BASE_URL}/tracks/${track.id}/upload`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			fetchTracks();
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			} else {
				setError(String(err));
			}
		}
	};

	const handleRemoveFile = async (track: Track) => {
		if (!window.confirm("Remove this audio file?")) return;
		try {
			await axios.delete(`${API_BASE_URL}/tracks/${track.id}/file`);
			fetchTracks();
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			} else {
				setError(String(err));
			}
		}
	};

	const handlePageChange = (page: number) => {
		setPaginationMeta((prev) => ({ ...prev, page }));
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

				<TrackList
					tracks={tracks}
					paginationMeta={paginationMeta}
					onEdit={setEditTrack}
					onDelete={handleDeleteTrack}
					onUpload={handleUploadFile}
					onRemoveFile={handleRemoveFile}
					fetchTracks={fetchTracks}
					onPageChange={handlePageChange}
					initialLoading={loading && !initialLoadComplete}
					error={error}
					loading={loading}
				/>

				<EditTrackModal
					isOpen={!!editTrack}
					onRequestClose={() => setEditTrack(null)}
					track={editTrack}
					onSave={handleUpdateTrack}
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
