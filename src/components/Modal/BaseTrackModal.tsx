import React, { useEffect } from "react";
import Modal from "react-modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DEFAULT_COVER_PLACEHOLDER, GENRES } from "../../config";
import "./CreateTrackModal.css";

const TrackSchema = z.object({
	title: z.string().min(1, "Title is required"),
	artist: z.string().min(1, "Artist is required"),
	album: z.string().transform((val) => val || ""),
	genres: z.array(z.string()).transform((val) => val || []),
	coverImage: z
		.string()
		.transform((val) => val || "")
		.refine(
			(val) => /^https?:\/\/.+/i.test(val) || val === "",
			"Invalid image URL"
		),
});

export type TrackFormData = z.infer<typeof TrackSchema>;

interface BaseTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	onSave: (data: TrackFormData) => Promise<void>; // ensure async
	initialData?: Partial<TrackFormData>;
	modalTitle?: string;
	submitButtonText?: string;
	externalErrors?: {
		title?: string;
		artist?: string;
		coverImage?: string;
	};
}

const BaseTrackModal: React.FC<BaseTrackModalProps> = ({
	isOpen,
	onRequestClose,
	onSave,
	initialData = {
		title: "",
		artist: "",
		album: "",
		genres: [],
		coverImage: "",
	},
	modalTitle = "Track",
	submitButtonText = "Save",
	externalErrors = {},
}) => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TrackFormData>({
		resolver: zodResolver(TrackSchema),
		defaultValues: {
			title: initialData.title ?? "",
			artist: initialData.artist ?? "",
			album: initialData.album ?? "",
			genres: initialData.genres ?? [],
			coverImage: initialData.coverImage ?? "",
		},
	});

	const genres = watch("genres") || [];
	const coverImage = watch("coverImage") || "";
	const [newGenre, setNewGenre] = React.useState("");
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			reset({
				title: initialData.title ?? "",
				artist: initialData.artist ?? "",
				album: initialData.album ?? "",
				genres: initialData.genres ?? [],
				coverImage: initialData.coverImage ?? "",
			});
		}
	}, [isOpen, initialData, reset]);

	const onSubmit: SubmitHandler<TrackFormData> = async (data) => {
		setSubmitError(null);
		try {
			await onSave(data);
			onRequestClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setSubmitError(err.message || "Failed to save track");
			} else {
				setSubmitError("Failed to save track");
			}
		}
	};

	const addGenre = () => {
		if (newGenre && !genres.includes(newGenre)) {
			setValue("genres", [...genres, newGenre]);
			setNewGenre("");
		}
	};

	const removeGenre = (genreToRemove: string) => {
		setValue(
			"genres",
			genres.filter((genre) => genre !== genreToRemove)
		);
	};

	const allErrors = {
		title: externalErrors.title || errors.title?.message,
		artist: externalErrors.artist || errors.artist?.message,
		coverImage: externalErrors.coverImage || errors.coverImage?.message,
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			className="modal"
			overlayClassName="overlay"
			ariaHideApp={false}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="modal-body">
				<h2>{modalTitle}</h2>

				<div className="form-group">
					<label htmlFor="track-title">Title *</label>
					<input
						id="track-title"
						{...register("title")}
						className={allErrors.title ? "error-input" : ""}
						placeholder="Enter track title"
					/>
					{allErrors.title && (
						<span className="error-message">{allErrors.title}</span>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="track-artist">Artist *</label>
					<input
						id="track-artist"
						{...register("artist")}
						className={allErrors.artist ? "error-input" : ""}
						placeholder="Enter artist name"
					/>
					{allErrors.artist && (
						<span className="error-message">{allErrors.artist}</span>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="track-album">Album</label>
					<input
						id="track-album"
						{...register("album")}
						placeholder="Enter album name (optional)"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="genre-select">Genres</label>
					<div className="genre-tags-container">
						{genres.map((genre) => (
							<span key={genre} className="genre-tag">
								{genre}
								<button
									type="button"
									className="remove-genre-btn"
									onClick={() => removeGenre(genre)}
								>
									×
								</button>
							</span>
						))}
					</div>
					<div className="genre-selector">
						<select
							id="genre-select"
							value={newGenre}
							onChange={(e) => setNewGenre(e.target.value)}
							className="genre-dropdown"
						>
							<option value="">Select a genre</option>
							{GENRES.filter((g) => !genres.includes(g)).map((genre) => (
								<option key={genre} value={genre}>
									{genre}
								</option>
							))}
						</select>
						<button
							type="button"
							className="add-genre-btn"
							onClick={addGenre}
							disabled={!newGenre}
							aria-label="Add genre"
						>
							+
						</button>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="track-cover">Cover Image URL</label>
					<input
						id="track-cover"
						{...register("coverImage")}
						className={allErrors.coverImage ? "error-input" : ""}
						placeholder="https://example.com/cover.jpg"
					/>
					{allErrors.coverImage && (
						<span className="error-message">{allErrors.coverImage}</span>
					)}
				</div>

				<div className="cover-preview">
					<img
						src={
							coverImage && /^https?:\/\/.+/.test(coverImage)
								? coverImage
								: DEFAULT_COVER_PLACEHOLDER
						}
						alt="Cover preview"
						onError={(e) => {
							(e.target as HTMLImageElement).src = DEFAULT_COVER_PLACEHOLDER;
						}}
					/>
				</div>

				{submitError && (
					<div className="error-message" style={{ marginBottom: 10 }}>
						{submitError}
					</div>
				)}

				<div className="modal-actions">
					<button type="button" className="cancel-btn" onClick={onRequestClose}>
						Cancel
					</button>
					<button type="submit" className="save-btn">
						{submitButtonText}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default React.memo(BaseTrackModal);
