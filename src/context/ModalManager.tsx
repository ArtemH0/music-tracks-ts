import { useTrackContext } from "./useTrackContext";
import CreateTrackModal from "../components/Modal/CreateTrackModal";
import EditTrackModal from "../components/Modal/EditTrackModal";
import type { TrackFormData } from "../types/track.types";

const ModalManager: React.FC = () => {
	const {
		modalOpen,
		setModalOpen,
		editTrack,
		setEditTrack,
		addTrack,
		updateTrack,
		fetchTracks,
		paginationMeta,
		genres, 
	} = useTrackContext();

	const handleSaveTrack = async (data: TrackFormData) => {
		try {
			const newTrack = {
				...data,
				duration: 0,
				coverUrl: data.coverImage,
			};
			await addTrack(newTrack);
			await fetchTracks({
				page: paginationMeta.page,
				limit: paginationMeta.limit,
			});
			setModalOpen(false);
		} catch (error) {
			console.error("Error saving track:", error);
		}
	};

	const handleUpdateTrack = async (updatedData: TrackFormData) => {
		if (editTrack) {
			try {
				await updateTrack(editTrack.id, {
					...updatedData,
					coverUrl: updatedData.coverImage,
				});
				await fetchTracks({
					page: paginationMeta.page,
					limit: paginationMeta.limit,
				});
				setEditTrack(null);
			} catch (error) {
				console.error("Error updating track:", error);
			}
		}
	};

	return (
		<>
			<CreateTrackModal
				isOpen={modalOpen}
				onRequestClose={() => setModalOpen(false)}
				onSave={handleSaveTrack}
				genres={genres}
			/>

			<EditTrackModal
				isOpen={!!editTrack}
				onRequestClose={() => setEditTrack(null)}
				track={editTrack}
				onSave={handleUpdateTrack}
				genres={genres}
			/>
		</>
	);
};

export default ModalManager;
