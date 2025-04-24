import { useState, useCallback, useEffect } from "react";
import type { Track, PaginationMeta } from "../types/track.types";
import tracksApi from "../api/tracksApi";
import { DEFAULT_PAGINATION } from "../config";

export const useTracks = () => {
	const [tracks, setTracks] = useState<Track[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [paginationMeta, setPaginationMeta] =
		useState<PaginationMeta>(DEFAULT_PAGINATION);

	const fetchTracks = useCallback(
		async (params?: Partial<PaginationMeta & { sort?: string; order?: "asc" | "desc"; artist?: string; genre?: string; search?: string }>) => {
			try {
				setLoading(true);
				const {
					page = paginationMeta.page,
					limit = paginationMeta.limit,
					sort,
					order,
					artist,
					genre,
					search,
				} = params || {};
				const response = await tracksApi.getTracks({
					page,
					limit,
					sort,
					order,
					artist,
					genre,
					search,
				});
				setTracks(response.data);
				setPaginationMeta(response.meta);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		},
		[paginationMeta.page, paginationMeta.limit]
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPaginationMeta((prev) => ({ ...prev, page: newPage }));
		},
		[]
	);

	const addTrack = useCallback(async (newTrack: Omit<Track, "id">) => {
		try {
			setLoading(true);
			const createdTrack = await tracksApi.createTrack(newTrack);
			setTracks((prev) => [createdTrack, ...prev]);
			return createdTrack;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to add track");
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateTrack = useCallback(
		async (id: string, updatedData: Partial<Track>) => {
			try {
				setLoading(true);
				const updatedTrack = await tracksApi.updateTrack(id, updatedData);
				setTracks((prev) =>
					prev.map((track) => (track.id === id ? updatedTrack : track))
				);
				return updatedTrack;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to update track");
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const deleteTrack = useCallback(async (id: string) => {
		try {
			setLoading(true);
			await tracksApi.deleteTrack(id);
			setTracks((prev) => prev.filter((track) => track.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete track");
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Only fetch once on mount
	useEffect(() => {
		fetchTracks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		tracks,
		loading,
		error,
		paginationMeta,
		fetchTracks,
		handlePageChange,
		setError,
		addTrack,
		updateTrack,
		deleteTrack,
	};
};
