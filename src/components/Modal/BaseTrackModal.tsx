import React, { useEffect } from "react";
import Modal from "react-modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DEFAULT_COVER_PLACEHOLDER } from "../../config";
import "./CreateTrackModal.css";

const TrackSchema = z.object({
	title: z.string().min(1, "Title is required"),
	artist: z.string().min(1, "Artist is required"),
	album: z.string().transform((val) => val || ""),
	genres: z.array(z.string()).min(1, "At least one genre is required"),
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
	onSave: (data: TrackFormData) => Promise<void>;
	initialData?: Partial<TrackFormData>;
	modalTitle?: string;
	submitButtonText?: string;
	externalErrors?: {
		title?: string;
		artist?: string;
		coverImage?: string;
	};
	genres: string[];
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
	genres,
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

	const genresState = watch("genres") || [];
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
		if (newGenre && !genresState.includes(newGenre)) {
			setValue("genres", [...genresState, newGenre], { shouldValidate: true });
			setNewGenre("");
		}
	};

	const removeGenre = (genreToRemove: string) => {
		setValue(
			"genres",
			genresState.filter((genre) => genre !== genreToRemove),
			{ shouldValidate: true }
		);
	};

	const allErrors = {
		title: externalErrors.title || errors.title?.message,
		artist: externalErrors.artist || errors.artist?.message,
		genres: errors.genres?.message,
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
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="modal-body"
				data-testid="track-form"
			>
				<h2>{modalTitle}</h2>

				<div className="form-group">
					<label htmlFor="track-title">Title *</label>
					<input
						id="track-title"
						{...register("title")}
						className={allErrors.title ? "error-input" : ""}
						placeholder="Enter track title"
						data-testid="input-title"
					/>
					{allErrors.title && (
						<span className="error-message" data-testid="error-title">
							{allErrors.title}
						</span>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="track-artist">Artist *</label>
					<input
						id="track-artist"
						{...register("artist")}
						className={allErrors.artist ? "error-input" : ""}
						placeholder="Enter artist name"
						data-testid="input-artist"
					/>
					{allErrors.artist && (
						<span className="error-message" data-testid="error-artist">
							{allErrors.artist}
						</span>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="track-album">Album</label>
					<input
						id="track-album"
						{...register("album")}
						placeholder="Enter album name (optional)"
						data-testid="input-album"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="genre-select">Genres *</label>
					<div className="genre-tags-container">
						{genresState.map((genre) => (
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
					{allErrors.genres && (
						<span className="error-message" data-testid="error-genre">
							{allErrors.genres}
						</span>
					)}
					<div className="genre-selector">
						<select
							id="genre-select"
							value={newGenre}
							onChange={(e) => setNewGenre(e.target.value)}
							className="genre-dropdown"
							data-testid="genre-selector"
						>
							<option value="">Select a genre</option>
							{genres
								.filter((g) => !genresState.includes(g))
								.map((genre) => (
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
						data-testid="input-cover-image"
					/>
					{allErrors.coverImage && (
						<span className="error-message" data-testid="error-cover-image">
							{allErrors.coverImage}
						</span>
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
					<button
						type="submit"
						className="save-btn"
						data-testid="submit-button"
					>
						{submitButtonText}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default React.memo(BaseTrackModal);
