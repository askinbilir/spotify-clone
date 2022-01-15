import Image from "next/image";
import { millisToMinutesAndSeconds } from "../lib/time";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";

const Song = ({ order, track }) => {
	const spotifyApi = useSpotify();

	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const playSong = () => {
		setCurrentTrackId(track.track.id);
		setIsPlaying(true);
		spotifyApi.play({
			uris: [track.track.uri]
		});
	};

	return (
		<div
			className="grid grid-cols-2 text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor-pointer"
			onClick={playSong}
		>
			<div className="flex items-center space-x-4">
				<p>{order}</p>
				<div className="relative w-10 h-10">
					<Image
						src={track.track.album.images[0].url}
						alt={track.track.name}
						layout="fill"
						objectFit="contain"
						priority={true}
					/>
				</div>
				<div>
					<p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
					<p className="w-40">{track.track.artists[0].name}</p>
				</div>
			</div>
			<div className="flex items-center justify-between ml-auto md:ml-0">
				<p className="hidden md:inline px-5 truncate">{track.track.album.name}</p>
				<p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
			</div>
		</div>
	);
};

export default Song;
