import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/HomePage';
import Navbar from './components/common/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import Profile from './pages/ProfilePage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './Redux/slices/usersSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import PrivateRoute from './components/common/PrivateRoute';
import StartPodcastPage from './pages/StartPodcastPage';
import PodcastsPage from './pages/PodcastsPage';
import PodcastDetailsPage from './pages/PodcastDetailsPage';
import CreateEpisodePage from './pages/CreateEpisodePage';
import ForgotPassword from './pages/ForgotPasswordPage';
import ChangePassword from './pages/ChangePasswordPage';
import EditProfile from './pages/EditProfileDetailsPage';
import { AnimatePresence } from 'framer-motion';

function App() {
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unSubscribeSnapShot = onSnapshot(
          doc(db, 'users', user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();

              dispatch(setUser({
                name: userData.name,
                email: userData.email,
                uid: user.uid,
                profile: userData.profile
              }))
            }
          },
          (error) => {
            console.log('Could not fetch user data', error);
          }
        );

        return () => {
          unSubscribeSnapShot();
        }
      }
    })

    return () => {
      authUnsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
      />
      <Navbar />
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route index path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/start-podcast' element={<StartPodcastPage />} />
            <Route path='/podcasts' element={<PodcastsPage />} />
            <Route path='/podcast/:id' element={<PodcastDetailsPage />} />
            <Route path='/podcast/:id/create-episode' element={<CreateEpisodePage />} />
            <Route path='/:id/changePassword' element={<ChangePassword />} />
            <Route path='/:id/editProfile' element={<EditProfile />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
