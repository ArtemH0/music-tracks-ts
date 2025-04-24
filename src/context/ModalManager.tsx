import React from "react";
import { useTrackContext } from "./TrackContext";
import CreateTrackModal from "../components/Modal/CreateTrackModal";
import EditTrackModal from "../components/Modal/EditTrackModal";
import type { TrackFormData } from "../types/track.types";

const ModalManager: React.FC = () => {
	const {
		modalOpen,
		setModalOpen,
		editTrack,
		setEditTrack,
		addTrack,
		updateTrack,
	} = useTrackContext();

	const handleSaveTrack = async (data: TrackFormData) => {
		const newTrack = {
			...data,
			duration: 0,
			coverUrl: data.coverImage,
		};
		await addTrack(newTrack);
		setModalOpen(false);
	};

	const handleUpdateTrack = async (updatedData: TrackFormData) => {
		if (editTrack) {
			await updateTrack(editTrack.id, {
				...updatedData,
				coverUrl: updatedData.coverImage,
			});
			setEditTrack(null);
		}
	};

	return (
		<>
			<CreateTrackModal
				isOpen={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				onSave={handleSaveTrack}
			/>

			<EditTrackModal
				isOpen={!!editTrack}
				onRequestClose={() => setEditTrack(null)}
				track={editTrack}
				onSave={handleUpdateTrack}
			/>
		</>
	);
};

export default ModalManager;
