import React from "react";
import BaseTrackModal, { TrackFormData } from "./BaseTrackModal";

interface CreateTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	onSave: (data: TrackFormData & { coverImage: string }) => void;
}

const CreateTrackModal: React.FC<CreateTrackModalProps> = ({
	isOpen,
	onRequestClose,
	onSave,
}) => {
	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={onSave}
			modalTitle="Create New Track"
			submitButtonText="Save Track"
		/>
	);
};

export default CreateTrackModal;
