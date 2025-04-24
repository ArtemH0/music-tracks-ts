import React, { useMemo } from "react";
import BaseTrackModal from "./BaseTrackModal";
import type { TrackFormData } from "./BaseTrackModal";
import type { Track } from "../../types/track.types";

interface EditTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	onSave: (data: TrackFormData) => Promise<void>;
	track: Track | null;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({
	isOpen,
	onRequestClose,
	onSave,
	track,
}) => {
	const initialData = useMemo(
		() =>
			track
				? {
						title: track.title || "",
						artist: track.artist || "",
						album: track.album || "",
						genres: track.genres || [],
						coverImage: track.coverUrl || "",
				  }
				: {
						title: "",
						artist: "",
						album: "",
						genres: [],
						coverImage: "",
				  },
		[track]
	);

	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={onSave}
			initialData={initialData}
			modalTitle="Edit Track"
			submitButtonText="Save Changes"
		/>
	);
};

export default React.memo(EditTrackModal);
