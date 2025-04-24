import axiosClient from "./axiosclient";
import { AUDIO_FILE_TYPES, MAX_FILE_SIZE } from "../config";
import type { Track } from "../types/track.types";


interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page: number;
		limit: number;
		totalPages: number;
	};
}

const tracksApi = {
	async getTracks(params: {
		page?: number;
		limit?: number;
		sort?: string;
		order?: "asc" | "desc";
		artist?: string;
		genre?: string;
		search?: string;
	}): Promise<PaginatedResponse<Track>> {
		const response = await axiosClient.get("/tracks", { params });
		return response.data;
	},

	async getTrackById(id: string): Promise<Track> {
		const response = await axiosClient.get(`/tracks/${id}`);
		return response.data;
	},

	async createTrack(trackData: Omit<Track, "id">): Promise<Track> {
		const response = await axiosClient.post("/tracks", trackData);
		return response.data;
	},

	async updateTrack(id: string, trackData: Partial<Track>): Promise<Track> {
		const response = await axiosClient.put(`/tracks/${id}`, trackData);
		return response.data;
	},

	async deleteTrack(id: string): Promise<void> {
		await axiosClient.delete(`/tracks/${id}`);
	},

	async uploadAudio(trackId: string, file: File): Promise<Track> {
		if (!AUDIO_FILE_TYPES.includes(file.type)) {
			throw new Error("Only MP3 or WAV files are allowed");
		}
		if (file.size > MAX_FILE_SIZE) {
			throw new Error("Max file size is 10MB");
		}

		const formData = new FormData();
		formData.append("file", file);

		const response = await axiosClient.post(
			`/tracks/${trackId}/upload`,
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	},

	async removeAudio(trackId: string): Promise<Track> {
		const response = await axiosClient.delete(`/tracks/${trackId}/file`);
		return response.data;
	},

	async getGenres(): Promise<string[]> {
		const response = await axiosClient.get("/genres");
		return response.data;
	},
};

export default tracksApi;
