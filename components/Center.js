import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/solid";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const RANDOM_COLORS = [
	"from-indigo-500",
	"from-blue-500",
	"from-green-500",
	"from-red-500",
	"from-yellow-500",
	"from-pink-500",
	"from-purple-500",
];

const Center = () => {
	const { data: session } = useSession();

	const spotifyApi = useSpotify();

	const [color, setColor] = useState(null);

	const playlistId = useRecoilValue(playlistIdState);
	const [playlist, setPlaylist] = useRecoilState(playlistState);

	useEffect(() => {
		setColor(shuffle(RANDOM_COLORS).pop());
	}, [playlistId]);

	useEffect(() => {
		spotifyApi
			.getPlaylist(playlistId)
			.then((data) => {
				setPlaylist(data.body);
			})
			.catch((error) => console.log("Something went wrong", error));
	}, [setPlaylist, spotifyApi, playlistId]);

	return (
		<div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
			<header className="absolute top-5 right-8">
				<div
					className="flex items-center bg-slate-900 text-white p-1 pr-2 space-x-3 rounded-full
                opacity-90 hover:opacity-80 cursor-pointer"
					onClick={() => signOut()}
				>
					<div className="relative w-10 h-10 rounded-full border-2">
						{session?.user.image ? (
							<Image
								src={session?.user?.image}
								alt={session?.user.name}
								layout="fill"
								objectFit="contain"
								priority={true}
								className="rounded-full"
							/>
						) : (
							<div className="flex w-full h-full rounded-full items-center justify-center bg-red-400">
								<h1 className="text-xl text-white uppercase">{session?.user.name[0]}</h1>
							</div>
						)}
					</div>
					<h2>{session?.user.name}</h2>
					<ChevronDownIcon className="w-5 h-5" />
				</div>
			</header>

			<section
				className={`flex h-80 items-end space-x-7 text-white p-8
            bg-gradient-to-b to-black ${color} `}
			>
				<div className="relative w-44 h-44 shadow-2xl">
					{playlist?.images?.[0]?.url ? (
						<Image
							src={playlist?.images?.[0]?.url}
							alt={playlist?.name}
							layout="fill"
							objectFit="contain"
							priority={true}
						/>
					) : (
						<div className="w-full h-full shadow-2xl" />
					)}
				</div>
				<div>
					<p>PLAYLIST</p>
					<h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
				</div>
			</section>

			<div>
				<Songs />
			</div>
		</div>
	);
};

export default Center;
