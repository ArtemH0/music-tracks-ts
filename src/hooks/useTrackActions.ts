import { useState, useEffect } from "react";
import type {
	Track,
	Playlist,
	PlayerState,
	PlayerActions,
} from "../types/track.types";

const ensureTrackType = (track: Track): Track => track;

export const useTrackActions = (
	initialState: PlayerState
): [PlayerState, PlayerActions] => {
	const [state, setState] = useState<PlayerState>(initialState);

	useEffect(() => {
		const savedState = localStorage.getItem("playerState");
		if (savedState) {
			try {
				const parsedState = JSON.parse(savedState);
				if (parsedState.currentTrack) {
					ensureTrackType(parsedState.currentTrack);
				}
				setState(parsedState);
			} catch (error) {
				console.error("Failed to parse player state", error);
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("playerState", JSON.stringify(state));
	}, [state]);

	const actions: PlayerActions = {
		playTrack: (track, playlist) => {
			ensureTrackType(track);
			setState((prev) => ({
				...prev,
				currentTrack: track,
				playlist: playlist || prev.playlist,
				isPlaying: true,
				duration: track.duration,
				currentTime: 0,
			}));
		},

		togglePlay: () => {
			setState((prev) => ({
				...prev,
				isPlaying: !prev.isPlaying,
			}));
		},

		setVolume: (volume) => {
			setState((prev) => ({
				...prev,
				volume: Math.max(0, Math.min(100, volume)), 
			}));
		},

		setCurrentTime: (time) => {
			setState((prev) => ({
				...prev,
				currentTime: Math.max(0, Math.min(prev.duration, time)), 
			}));
		},

		playNext: () => {
			if (!state.playlist?.tracks || !state.currentTrack) return;

			const currentIndex = state.playlist.tracks.findIndex(
				(t) => t.id === state.currentTrack?.id
			);

			if (currentIndex < state.playlist.tracks.length - 1) {
				const nextTrack = state.playlist.tracks[currentIndex + 1];
				actions.playTrack(nextTrack);
			}
		},

		playPrevious: () => {
			if (!state.playlist?.tracks || !state.currentTrack) return;

			const currentIndex = state.playlist.tracks.findIndex(
				(t) => t.id === state.currentTrack?.id
			);

			if (currentIndex > 0) {
				const prevTrack = state.playlist.tracks[currentIndex - 1];
				actions.playTrack(prevTrack);
			}
		},

		addToPlaylist: (track) => {
			if (!state.playlist) return;
			ensureTrackType(track);

			setState((prev) => ({
				...prev,
				playlist: {
					...prev.playlist!,
					tracks: [...prev.playlist!.tracks, track],
				},
			}));
		},

		removeFromPlaylist: (trackId) => {
			if (!state.playlist) return;

			setState((prev) => ({
				...prev,
				playlist: {
					...prev.playlist!,
					tracks: prev.playlist!.tracks.filter((t) => t.id !== trackId),
				},
			}));
		},

		createPlaylist: (name) => {
			const newPlaylist: Playlist = {
				id: Date.now().toString(),
				name,
				tracks: [],
			};

			setState((prev) => ({
				...prev,
				playlist: newPlaylist,
			}));
		},
	};

	return [state, actions];
};
