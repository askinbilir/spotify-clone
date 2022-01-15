import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

const login = ({ providers }) => {
	return (
		<div className="flex flex-col items-center justify-center bg-black min-h-screen w-full ">
			<div className="relative w-52 h-52 mb-5">
				<Image
					src="http://links.papareact.com/9xl"
					alt="Spotify icon"
					layout="fill"
                    objectFit="contain"
                    priority={true}
				/>
			</div>

			{Object.values(providers).map((provider) => (
				<button
					className="bg-green-500 text-white p-5 rounded-full"
					key={provider.id}
					onClick={() => signIn(provider.id, {callbackUrl: "/"})}
				>
					Login with {provider.name}
				</button>
			))}
		</div>
	);
};

export default login;

export async function getServerSideProps(context) {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
}
