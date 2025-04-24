import React from "react";

interface AudioPlayerProps {
	audioUrl: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
	if (!audioUrl) return null;

	return (
		<div className="audio-player" data-testid="audio-player-{id}">
			<audio controls>
				<source src={audioUrl} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		</div>
	);
};

export default AudioPlayer;
