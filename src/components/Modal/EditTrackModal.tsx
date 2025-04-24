import React from "react";
import BaseTrackModal, { TrackFormData } from "./BaseTrackModal";
import type { Track } from "../../types/track.types";

interface EditTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	track: Track | null;
	onSave: (updatedData: Track) => void;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({
	isOpen,
	onRequestClose,
	track,
	onSave,
}) => {
	const handleSave = (formData: TrackFormData) => {
		if (track) {
			onSave({
				...track,
				title: formData.title,
				artist: formData.artist,
				album: formData.album || "",
				genres: formData.genres || [],
				coverUrl: formData.coverImage || "",
			});
		}
	};

	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={handleSave}
			initialData={{
				title: track?.title || "",
				artist: track?.artist || "",
				album: track?.album || "",
				genres: track?.genres || [],
				coverImage: track?.coverUrl || "",
			}}
			modalTitle="Edit Track"
			submitButtonText="Save Changes"
		/>
	);
};

export default EditTrackModal;
