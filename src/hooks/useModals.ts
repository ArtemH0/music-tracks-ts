import { useState } from "react";
import type { Track } from "../types/track.types";

export const useModals = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [editTrack, setEditTrack] = useState<Track | null>(null);

	return { modalOpen, setModalOpen, editTrack, setEditTrack };
};
