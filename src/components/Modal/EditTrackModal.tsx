import React from "react";
import BaseTrackModal from "./BaseTrackModal";

interface Track {
	id: string;
	title: string;
	artist: string;
	album?: string;
	genres?: string[];
	coverImage?: string;
}

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
	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={(updatedData) => {
				if (track) {
					onSave({ ...track, ...updatedData });
				}
			}}
			initialData={{
				title: track?.title || "",
				artist: track?.artist || "",
				album: track?.album || "",
				genres: track?.genres || [],
				coverImage: track?.coverImage || "",
			}}
			modalTitle="Edit Track"
			submitButtonText="Save Changes"
			handleOnClose={() => {}}
		/>
	);
};

export default EditTrackModal;
