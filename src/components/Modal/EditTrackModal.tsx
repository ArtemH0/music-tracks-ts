import React, { useState, useEffect, useMemo } from "react";
import BaseTrackModal from "./BaseTrackModal";
import type { Track } from "../../types/track.types";
import type { TrackFormData } from "./BaseTrackModal";

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
	const [errors, setErrors] = useState({
		title: "",
		artist: "",
		coverImage: "",
	});

	const initialData = useMemo(
		() => ({
			title: track?.title || "",
			artist: track?.artist || "",
			album: track?.album || "",
			genres: track?.genres || [],
			coverImage: track?.coverUrl || "",
		}),
		[track]
	);

	useEffect(() => {
		if (isOpen) {
			setErrors({
				title: "",
				artist: "",
				coverImage: "",
			});
		}
	}, [isOpen]);

	const validateForm = (data: {
		title: string;
		artist: string;
		coverImage: string;
	}) => {
		const newErrors = {
			title: data.title.trim() ? "" : "Title is required",
			artist: data.artist.trim() ? "" : "Artist is required",
			coverImage: data.coverImage
				? /^https?:\/\/.+/i.test(data.coverImage)
					? ""
					: "Invalid image URL (must start with http:// or https://)"
				: "",
		};

		setErrors(newErrors);
		return !newErrors.title && !newErrors.artist && !newErrors.coverImage;
	};

	const handleSave = (updatedData: TrackFormData) => {
		const isValid = validateForm({
			title: updatedData.title,
			artist: updatedData.artist,
			coverImage: updatedData.coverImage,
		});

		if (!isValid) return;

		if (track) {
			onSave({
				...track,
				title: updatedData.title,
				artist: updatedData.artist,
				album: updatedData.album,
				genres: updatedData.genres,
				coverUrl: updatedData.coverImage,
			});
		}
	};

	return (
		<BaseTrackModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			onSave={handleSave}
			initialData={initialData}
			modalTitle="Edit Track"
			submitButtonText="Save Changes"
			externalErrors={errors}
		/>
	);
};

export default React.memo(EditTrackModal);
