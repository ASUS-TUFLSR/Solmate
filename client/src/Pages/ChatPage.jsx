import { useEffect, useRef } from "react";
import Header from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../components/MessageInput";
import { useOnlineStore } from "../store/useOnlineStore";

const ChatPage = () => {
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const {
    messages,
    getMessages,
    subscribeToMessage,
    unsubscribeFromMessage,
  } = useMessageStore();
  const { authUser } = useAuthStore();
  const { onlineUsers } = useOnlineStore();
  const messagesEndRef = useRef(null);

  const { id } = useParams();

  const match = Array.isArray(matches)
    ? matches.find((m) => m?._id === id)
    : null;

  useEffect(() => {
    if (authUser && id) {
      getMyMatches();
      getMessages(id);
      subscribeToMessage();
    }

    return () => {
      unsubscribeFromMessage();
    };
  }, [
    getMyMatches,
    authUser,
    getMessages,
    subscribeToMessage,
    unsubscribeFromMessage,
    id,
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoadingMyMatches || !Array.isArray(matches)) {
    return <LoadingMessagesUI />;
  }

  if (!match) {
    return <MatchNotFound />;
  }

  const isOnline = onlineUsers.includes(match._id);

  return (
    <div className="flex flex-col h-screen bg-gray-100 bg-opacity-50">
      <Header />

      <div className="grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full">
        {/* ===== Chat Header ===== */}
        <div className="flex items-center gap-3 mb-4 bg-white rounded-lg shadow p-3">
          <div className="relative">
            <img
              src={match.image || "/avatar.png"}
              className="w-12 h-12 object-cover rounded-full border-2 border-pink-300"
              alt={match.name}
            />

            {/* Online / Offline Dot */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800">
              {match.name}
            </h2>
            <p className="text-sm text-gray-500">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* ===== Messages ===== */}
        <div className="grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
          {!Array.isArray(messages) || messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Start your conversation with {match.name}
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-3 ${
                  msg.sender === authUser._id ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                    msg.sender === authUser._id
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ===== Message Input ===== */}
        <MessageInput match={match} />
      </div>
    </div>
  );
};

export default ChatPage;

/* =================== FALLBACK UI =================== */

const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <UserX size={64} className="mx-auto text-pink-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Match Not Found
      </h2>
      <p className="text-gray-600">
        Oops! This match doesn’t exist or was removed.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition inline-block"
      >
        Go Back Home
      </Link>
    </div>
  </div>
);

const LoadingMessagesUI = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <Loader size={48} className="mx-auto text-pink-500 animate-spin mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Loading Chat
      </h2>
      <p className="text-gray-600">
        Please wait while we fetch your conversation...
      </p>
    </div>
  </div>
);
