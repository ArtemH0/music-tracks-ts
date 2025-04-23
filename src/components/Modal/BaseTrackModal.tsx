import React, { useState } from "react";
import Modal from "react-modal";
import "./CreateTrackModal.css";
import { DEFAULT_COVER_PLACEHOLDER, GENRES } from "../../config";

interface TrackFormData {
	title: string;
	artist: string;
	album: string;
	genres: string[];
	coverImage: string;
}

interface FormErrors {
	title?: string;
	artist?: string;
	cover?: string;
	[key: string]: string | undefined;
}

interface BaseTrackModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	onSave: (
		data: Omit<TrackFormData, "coverImage"> & { coverImage: string }
	) => void;
	initialData?: Partial<TrackFormData>;
	modalTitle?: string;
	submitButtonText?: string;
	validateForm?: (data: {
		title: string;
		artist: string;
		coverLink: string;
	}) => FormErrors;
	handleOnClose?: () => void;
}

const isValidImageUrl = (url: string) => /^https?:\/\/.+/i.test(url);

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
	validateForm,
	handleOnClose,
}) => {
	const [title, setTitle] = useState(initialData.title || "");
	const [artist, setArtist] = useState(initialData.artist || "");
	const [album, setAlbum] = useState(initialData.album || "");
	const [genres, setGenres] = useState(initialData.genres || []);
	const [newGenre, setNewGenre] = useState("");
	const [coverLink, setCoverLink] = useState(initialData.coverImage || "");
	const [errors, setErrors] = useState<FormErrors>({});

	const addGenre = () => {
		if (newGenre && !genres.includes(newGenre)) {
			setGenres([...genres, newGenre]);
			setNewGenre("");
		}
	};

	const removeGenre = (genreToRemove: string) => {
		setGenres(genres.filter((genre) => genre !== genreToRemove));
	};

	const resetForm = () => {
		setTitle(initialData.title || "");
		setArtist(initialData.artist || "");
		setAlbum(initialData.album || "");
		setGenres(initialData.genres || []);
		setNewGenre("");
		setCoverLink(initialData.coverImage || "");
		setErrors({});
	};

	const handleSubmit = () => {
		// Run validation if provided
		if (validateForm) {
			const validationErrors = validateForm({ title, artist, coverLink });
			if (validationErrors && Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
				return;
			}
		}

		const trackData = {
			title,
			artist,
			album: album.trim(),
			genres,
			coverImage: isValidImageUrl(coverLink) ? coverLink : "",
		};

		onSave(trackData);
		onRequestClose();
	};

	const handleClose = () => {
		if (handleOnClose) {
			handleOnClose();
		} else {
			resetForm();
		}
		onRequestClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={handleClose}
			className="modal"
			overlayClassName="overlay"
		>
			<div className="modal-body">
				<h2>{modalTitle}</h2>

				<div className="form-group">
					<label htmlFor="track-title">Title</label>
					<input
						id="track-title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className={errors.title ? "error-input" : ""}
					/>
					{errors.title && (
						<span className="error-message">{errors.title}</span>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="track-artist">Artist</label>
					<input
						id="track-artist"
						value={artist}
						onChange={(e) => setArtist(e.target.value)}
						className={errors.artist ? "error-input" : ""}
					/>
					{errors.artist && (
						<span className="error-message">{errors.artist}</span>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="track-album">Album</label>
					<input
						id="track-album"
						value={album}
						onChange={(e) => setAlbum(e.target.value)}
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
									aria-label={`Remove ${genre}`}
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
							{GENRES.filter((genre) => !genres.includes(genre)).map(
								(genre) => (
									<option key={genre} value={genre}>
										{genre}
									</option>
								)
							)}
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
						value={coverLink}
						onChange={(e) => setCoverLink(e.target.value)}
						className={errors.cover ? "error-input" : ""}
					/>
					{errors.cover && (
						<span className="error-message">{errors.cover}</span>
					)}
				</div>

				<div className="cover-preview">
					<img
						src={
							isValidImageUrl(coverLink) ? coverLink : DEFAULT_COVER_PLACEHOLDER
						}
						alt="Cover preview"
						onError={(e) => {
							(e.target as HTMLImageElement).src = DEFAULT_COVER_PLACEHOLDER;
						}}
					/>
				</div>

				<div className="modal-actions">
					<button type="button" className="cancel-btn" onClick={handleClose}>
						Cancel
					</button>
					<button type="button" className="save-btn" onClick={handleSubmit}>
						{submitButtonText}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default BaseTrackModal;
