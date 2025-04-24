import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTrackContext } from "../../context/useTrackContext";
import "./TrackList.css";
import { DEFAULT_COVER, FILES_BASE_URL, GENRES } from "../../config";
import type { Track } from "../../types/track.types";

const TrackList: React.FC = () => {
	const {
		tracks,
		loading,
		paginationMeta,
		fetchTracks,
		setEditTrack,
		deleteTrack,
		uploadAudio,
		removeAudio,
		setModalOpen,
	} = useTrackContext();

	const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
	const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
	const [sortConfig, setSortConfig] = useState<{
		key: string | null;
		direction: "asc" | "desc";
	}>({
		key: null,
		direction: "asc",
	});
	const [filters, setFilters] = useState<{
		artist: string;
		genre: string;
		search: string;
	}>({
		artist: "",
		genre: "",
		search: "",
	});
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	const debounce = useCallback((func: () => void, delay: number) => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}
		debounceTimeout.current = setTimeout(func, delay);
	}, []);

	useEffect(() => {
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, []);

	const handlePlay = (trackId: string) => {
		if (currentPlayingId === trackId) {
			audioRefs.current[trackId]?.pause();
			setCurrentPlayingId(null);
		} else {
			if (currentPlayingId && audioRefs.current[currentPlayingId]) {
				audioRefs.current[currentPlayingId]?.pause();
			}
			setCurrentPlayingId(trackId);
			setTimeout(() => audioRefs.current[trackId]?.play(), 0);
		}
	};

	const requestSort = (key: string) => {
		const direction =
			sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
		setSortConfig({ key, direction });
		fetchTracks({
			page: 1,
			limit: paginationMeta.limit,
			sort: key,
			order: direction,
			artist: filters.artist || undefined,
			genre: filters.genre || undefined,
			search: filters.search || undefined,
		});
	};

	const handleClearSort = () => {
		setSortConfig({ key: null, direction: "asc" });
		fetchTracks({
			page: 1,
			limit: paginationMeta.limit,
			sort: undefined,
			order: undefined,
			artist: filters.artist || undefined,
			genre: filters.genre || undefined,
			search: filters.search || undefined,
		});
	};

	const handleFilterChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));

		if (name === "search" || name === "artist") {
			debounce(() => {
				fetchTracks({
					page: 1,
					limit: paginationMeta.limit,
					sort: sortConfig.key ?? undefined,
					order: sortConfig.direction,
					artist: name === "artist" ? value : filters.artist || undefined,
					genre: filters.genre || undefined,
					search: name === "search" ? value : filters.search || undefined,
				});
			}, 500);
		} else {
			fetchTracks({
				page: 1,
				limit: paginationMeta.limit,
				sort: sortConfig.key ?? undefined,
				order: sortConfig.direction,
				artist: filters.artist || undefined,
				genre: value || undefined,
				search: filters.search || undefined,
			});
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage !== paginationMeta.page) {
			fetchTracks({
				page: newPage,
				limit: paginationMeta.limit,
				sort: sortConfig.key ?? undefined,
				order: sortConfig.direction,
				artist: filters.artist || undefined,
				genre: filters.genre || undefined,
				search: filters.search || undefined,
			});
		}
	};

	return (
		<div className="track-list-container">
			<h2>Track List</h2>
			<button
				type="button"
				className="blue-button"
				onClick={() => setModalOpen(true)}
				style={{ marginBottom: 16 }}
			>
				Create Track
			</button>

			<div className="search-forms">
				<form onSubmit={(e) => e.preventDefault()}>
					<input
						type="text"
						placeholder="Search tracks..."
						name="search"
						value={filters.search}
						onChange={handleFilterChange}
					/>
				</form>

				<form onSubmit={(e) => e.preventDefault()}>
					<input
						type="text"
						placeholder="Filter by artist..."
						name="artist"
						value={filters.artist}
						onChange={handleFilterChange}
					/>
				</form>

				<form onSubmit={(e) => e.preventDefault()}>
					<select
						name="genre"
						value={filters.genre}
						onChange={handleFilterChange}
						className="genre-select"
					>
						<option value="">All Genres</option>
						{GENRES.map((genre: string) => (
							<option key={genre} value={genre}>
								{genre}
							</option>
						))}
					</select>
				</form>
			</div>

			<div className="sort-controls">
				<button type="button" onClick={() => requestSort("title")}>
					Sort by Title{" "}
					{sortConfig.key === "title" &&
						(sortConfig.direction === "asc" ? "↑" : "↓")}
				</button>
				<button type="button" onClick={() => requestSort("artist")}>
					Sort by Artist{" "}
					{sortConfig.key === "artist" &&
						(sortConfig.direction === "asc" ? "↑" : "↓")}
				</button>
				<button type="button" onClick={() => requestSort("album")}>
					Sort by Album{" "}
					{sortConfig.key === "album" &&
						(sortConfig.direction === "asc" ? "↑" : "↓")}
				</button>
				<button type="button" onClick={() => requestSort("createdAt")}>
					Sort by Date{" "}
					{sortConfig.key === "createdAt" &&
						(sortConfig.direction === "asc" ? "↑" : "↓")}
				</button>
				{sortConfig.key && (
					<button
						type="button"
						className="clear-sort-button"
						onClick={handleClearSort}
					>
						Clear Sort
					</button>
				)}
			</div>

			{loading && (
				<div className="loading-container">
					<div className="loading-spinner">
						<div className="spinner-sector spinner-sector-blue" />
						<div className="spinner-sector spinner-sector-white" />
					</div>
					<p>Loading tracks...</p>
				</div>
			)}

			{!loading && (
				<>
					<ul className="tracks-list">
						{tracks.map((track: Track) => (
							<li key={track.id} className="track-item">
								<img
									src={track.coverUrl || DEFAULT_COVER}
									alt="cover"
									className="track-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src = DEFAULT_COVER;
									}}
								/>
								<div className="track-content">
									<div className="track-info">
										<h3>{track.title}</h3>
										<p>
											<strong>Artist:</strong> {track.artist}
										</p>
										{track.album && (
											<p>
												<strong>Album:</strong> {track.album}
											</p>
										)}
										{(track.genres ?? []).length > 0 && (
											<div className="track-genres">
												<strong>Genres: </strong>
												{(track.genres ?? []).map((genre: string) => (
													<span key={genre} className="genre-tag">
														{genre}
													</span>
												))}
											</div>
										)}

										{track.audioFile && (
											<audio
												ref={(el) => {
													if (track.id) {
														audioRefs.current[track.id] = el;
													}
												}}
												controls
												className="audio-player"
												onPlay={() => track.id && handlePlay(track.id)}
											>
												<source
													src={`${FILES_BASE_URL}/${track.audioFile}`}
													type="audio/mpeg"
												/>
												Your browser does not support the audio element.
											</audio>
										)}

										<div className="audio-actions">
											<label className="upload-button">
												Upload Audio
												<input
													type="file"
													accept=".mp3,.wav"
													onChange={(e) =>
														uploadAudio(track.id, e.target.files?.[0] as File)
													}
													hidden
												/>
											</label>
											{track.audioFile && (
												<button
													type="button"
													className="delete-button small"
													onClick={() => removeAudio(track.id)}
												>
													Remove Audio
												</button>
											)}
										</div>
									</div>

									<div className="track-actions">
										<button
											type="button"
											className="edit-button"
											onClick={() => setEditTrack(track)}
										>
											Edit
										</button>
										<button
											type="button"
											className="delete-button"
											onClick={() => deleteTrack(track.id)}
										>
											Delete
										</button>
									</div>
								</div>
							</li>
						))}
					</ul>

					<div className="pagination">
						<button
							type="button"
							onClick={() => handlePageChange(paginationMeta.page - 1)}
							disabled={paginationMeta.page === 1}
						>
							Previous
						</button>
						<span>
							Page {paginationMeta.page} of {paginationMeta.totalPages}
						</span>
						<button
							type="button"
							onClick={() => handlePageChange(paginationMeta.page + 1)}
							disabled={paginationMeta.page === paginationMeta.totalPages}
						>
							Next
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default React.memo(TrackList);
