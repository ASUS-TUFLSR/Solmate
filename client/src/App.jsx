import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AuthPage from  "./Pages/AuthPage"
import ProfilePage from "./Pages/ProfilePage";
import ChatPage from "./Pages/ChatPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useOnlineStore } from "./store/useOnlineStore";
import { useEffect } from "react";

function App() {
const {checkAuth, authUser, checkingAuth} = useAuthStore();

  useEffect(() => {
   checkAuth()
  }, [checkAuth]);

  useEffect(() => {
	if (authUser) {
		useOnlineStore.getState().subscribeToOnlineUsers();
	}

	return () => {
		useOnlineStore.getState().unsubscribeFromOnlineUsers();
	};
  }, [authUser])

  if(checkingAuth) return null;

	return (
		<div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]'>
			<Routes>
				<Route path='/' element={ authUser ? <HomePage /> : <Navigate to={"/auth"} />} />
				<Route path='/auth' element={ !authUser ? <AuthPage /> : <Navigate to={"/"} />} />
				<Route path='/profile' element={ authUser ? <ProfilePage/> : <Navigate to={"/auth"} />} />
				<Route path='/chat/:id' element={ authUser ? <ChatPage /> : <Navigate to={"/auth"} />} />
			</Routes>

			<Toaster />
		</div>
	);
}

export default App;