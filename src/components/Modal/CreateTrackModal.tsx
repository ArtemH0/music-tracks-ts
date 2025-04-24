import React, { useMemo } from "react";
import BaseTrackModal from "./BaseTrackModal";
import { TrackFormData } from "./BaseTrackModal";

interface CreateTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	onSave: (data: TrackFormData) => Promise<void>;
}

const CreateTrackModal: React.FC<CreateTrackModalProps> = ({
	isOpen,
	onRequestClose,
	onSave,
}) => {
	const initialData = useMemo(
		() => ({
			title: "",
			artist: "",
			album: "",
			genres: [],
			coverImage: "",
		}),
		[]
	);

	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={onSave}
			initialData={initialData}
			modalTitle="Create New Track"
			submitButtonText="Save Track"
		/>
	);
};

export default React.memo(CreateTrackModal);
