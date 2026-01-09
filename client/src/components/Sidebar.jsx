import React, { useEffect, useState, useMemo } from "react";
import { Heart, Loader, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import { useOnlineStore } from "../store/useOnlineStore";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [showOnlineOnly, setShowOnlineOnly] = useState(false);

	const toggleSidebar = () => setIsOpen(!isOpen);

	const { getMyMatches, IsLoadingMyMatches, matches } = useMatchStore();
	const { onlineUsers } = useOnlineStore();

	useEffect(() => {
		getMyMatches();
	}, [getMyMatches]);

	// ✅ filter matches based on toggle
	const filteredMatches = useMemo(() => {
		if (!Array.isArray(matches)) return [];
		if (!showOnlineOnly) return matches;

		return matches.filter((m) => onlineUsers.includes(m._id));
	}, [matches, showOnlineOnly, onlineUsers]);

	return (
		<>
			<div
				className={`
				fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden
				transition-transform duration-300 ease-in-out
				${isOpen ? "translate-x-0" : "-translate-x-full"}
				lg:translate-x-0 lg:static lg:w-1/4
			`}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="p-4 border-b border-pink-200 flex justify-between items-center">
						<h2 className="text-xl font-bold text-pink-600">Matches</h2>
						<button
							className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
							onClick={toggleSidebar}
						>
							<X size={24} />
						</button>
					</div>

					{/* Online toggle */}
					<div className="mt-3 hidden lg:flex items-center gap-2 px-4">
						<label className="cursor-pointer flex items-center gap-2">
							<input
								type="checkbox"
								checked={showOnlineOnly}
								onChange={(e) => setShowOnlineOnly(e.target.checked)}
								className="checkbox checkbox-sm"
							/>
							<span className="text-sm">Show Online Only</span>
						</label>
						<span className="text-xs text-zinc-500">
							({Math.max(onlineUsers.length - 1, 0)} online)
						</span>
					</div>

					{/* Matches */}
					<div className="grow overflow-y-auto p-4 relative">
						{IsLoadingMyMatches ? (
							<LoadingState />
						) : filteredMatches.length === 0 ? (
							<NoMatchesFound />
						) : (
							filteredMatches.map((match) => {
								const isOnline = onlineUsers.includes(match._id);

								return (
									<Link
										key={match._id}
										to={`/chat/${match._id}`}
										onClick={() => setIsOpen(false)}
									>
										<div className="flex items-center mb-4 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-colors">
											{/* Avatar + online dot */}
											<div className="relative mr-3">
												<img
													src={match.image || "/avatar.png"}
													alt="User avatar"
													className="size-12 object-cover rounded-full border-2 border-pink-300"
												/>
												<span
													className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
														isOnline ? "bg-green-500" : "bg-gray-300"
													}`}
												/>
											</div>

											<h3 className="font-semibold text-gray-800">
												{match.name}
											</h3>
										</div>
									</Link>
								);
							})
						)}
					</div>
				</div>
			</div>

			{/* Mobile toggle button */}
			<button
				className="lg:hidden fixed top-4 left-4 p-2 bg-pink-500 text-white rounded-md z-0"
				onClick={toggleSidebar}
			>
				<MessageCircle size={26} />
			</button>
		</>
	);
};

export default Sidebar;

/* -------------------- UI STATES -------------------- */

const NoMatchesFound = () => (
	<div className="flex flex-col items-center justify-center h-full text-center">
		<Heart className="text-pink-400 mb-4" size={48} />
		<h3 className="text-xl font-semibold text-gray-700 mb-2">
			No Matches Yet
		</h3>
		<p className="text-gray-500 max-w-xs">
			Don&apos;t worry! Your perfect match is just around the corner.
		</p>
	</div>
);

const LoadingState = () => (
	<div className="flex flex-col items-center justify-center h-full text-center">
		<Loader className="text-pink-500 mb-4 animate-spin" size={48} />
		<h3 className="text-xl font-semibold text-gray-700 mb-2">
			Loading Matches
		</h3>
		<p className="text-gray-500 max-w-xs">
			We&apos;re finding your perfect matches…
		</p>
	</div>
);
