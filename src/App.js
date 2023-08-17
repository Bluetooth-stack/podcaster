import './App.css';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  const dispatch = useDispatch();

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
                // profile: userData.profile
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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<SigninPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
