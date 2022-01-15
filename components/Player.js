import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	RewindIcon,
	VolumeUpIcon,
	SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

const Player = () => {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();

	const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const [volume, setVolume] = useState(50);
	const volumeRef = useRef(volume);
	const changeVolume = () => setVolume(Number(volumeRef.current.value));
	const volumeDown = () => (volume - 10 >= 0 ? setVolume(volume - 10) : setVolume(0));
	const volumeUp = () => (volume + 10 <= 100 ? setVolume(volume + 10) : setVolume(100));

	const songInfo = useSongInfo();

	console.log(volume);

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				console.log("Now playing ", data.body?.item);
				setCurrentTrackId(data.body?.item?.id);

				spotifyApi.getMyCurrentPlaybackState().then((data) => setIsPlaying(data.body?.is_playing));
			});
		}
	};

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body?.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}
		});
	};

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackId, spotifyApi, session]);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch((err) => console.log(err));
		}, 500),
		[]
	);

	return (
		<div className="h-24 grid grid-cols-3 text-xs md:text-base px-2 md:px-8 text-white bg-gradient-to-b from-black to-gray-900">
			{/* Left  */}
			<div className="flex items-center space-x-4">
				<div className="relative w-10 h-10 hidden md:inline">
					{songInfo?.album.images?.[0].url ? (
						<Image
							src={songInfo?.album.images?.[0].url}
							alt={songInfo?.name}
							layout="fill"
							objectFit="contain"
							priority={true}
						/>
					) : (
						<div className="w-full h-full shadow-2xl" />
					)}
				</div>
				<h3>{songInfo?.name}</h3>
				<p>{songInfo?.artist?.[0].name}</p>
			</div>

			{/* Center  */}
			<div className="flex items-center justify-evenly">
				<SwitchHorizontalIcon className="player-button" />
				<RewindIcon
					className="player-button"
					// onClick={() => spotifyApi.skipToPrevious}}
				/>

				{isPlaying ? (
					<PauseIcon className="player-button w-10 h-10" onClick={handlePlayPause} />
				) : (
					<PlayIcon className="player-button w-10 h-10" onClick={handlePlayPause} />
				)}

				<FastForwardIcon
					className="player-button"
					// onClick={() => spotifyApi.skipToNext}}
				/>
				<ReplyIcon className="player-button" />
			</div>

			{/* Right  */}

			<div className="flex items-center pr-5 space-x-3 md:space-x-4 justify-end">
				<VolumeDownIcon className="player-button" onClick={volumeDown} />
				<input
					className="w-16 md:w-24 lg:w-32"
					type="range"
					min="0"
					max="100"
					value={volume}
					ref={volumeRef}
					onChange={changeVolume}
				/>
				<VolumeUpIcon className="player-button" onClick={volumeUp} />
			</div>
		</div>
	);
};

export default Player;
