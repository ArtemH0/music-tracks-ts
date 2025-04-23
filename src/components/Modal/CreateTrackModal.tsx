import React from "react";
import BaseTrackModal from "./BaseTrackModal";

interface CreateTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	onSave: (data: {
		title: string;
		artist: string;
		album: string;
		genres: string[];
		coverImage: string;
	}) => void;
}

const CreateTrackModal: React.FC<CreateTrackModalProps> = ({
	isOpen,
	onRequestClose,
	onSave,
}) => {
	const validateForm = ({
		title,
		artist,
		coverLink,
	}: {
		title: string;
		artist: string;
		coverLink: string;
	}) => {
		const newErrors: Record<string, string> = {};
		if (!title.trim()) newErrors.title = "Title is required";
		if (!artist.trim()) newErrors.artist = "Artist is required";
		if (coverLink && !/^https?:\/\/.+/i.test(coverLink)) {
			newErrors.cover = "Invalid image URL";
		}
		return newErrors;
	};

	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={onSave}
			modalTitle="Create New Track"
			submitButtonText="Save Track"
			validateForm={validateForm}
		/>
	);
};

export default CreateTrackModal;
