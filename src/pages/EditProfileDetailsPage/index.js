import React, { useState } from 'react';
import Loader from '../../components/common/Loading';
import { auth, db, fbProvider, gProvider, storage } from '../../firebase';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DefaultDp from '../../Assets/defaultDp.jpg'
import DpInput from '../../components/common/Input/DpInput';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { EmailAuthProvider, deleteUser, reauthenticateWithCredential, signInWithPopup, updateProfile } from 'firebase/auth';
import { clearUser, setUser } from '../../Redux/slices/usersSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../../PageTransition';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(auth.currentUser.displayName);
  const [previewDp, setpreviewDp] = useState(auth.currentUser.photoURL ? auth.currentUser.photoURL : DefaultDp);
  const [displayPic, setDisplayPic] = useState(auth.currentUser.photoURL);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [pass, setPass] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleConfirm() {
    if ((displayPic || userName) || (displayPic && userName)) {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        const profileImageRef = ref(
          storage,
          `userDisplayImage/${user.uid}/${Date.now()}`
        );

        await uploadBytes(profileImageRef, displayPic);

        const profileImgUrl = await getDownloadURL(profileImageRef);

        await updateProfile(auth.currentUser, {
          displayName: userName, photoURL: profileImgUrl
        });

        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {profile: profileImgUrl});

        //setting into redux userSlice
        dispatch(setUser({
          name: userName,
          email: user.email,
          uid: user.uid,
          profile: profileImgUrl
        }))

        setIsLoading(false);
        toast.success('Edit Successful!')
        navigate('/profile')
      }
      catch (err) {
        setIsLoading(false);
        toast.error(err?.message);
      }
    }
    else {
      toast.warning('No changes made!');
      navigate('/profile');
    }
  }

  function handleChange(file) {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener("load", function () { setpreviewDp(this.result) });
      setDisplayPic(file);
    }
  }

  async function googleOrFbCheck() {
    if (auth.currentUser.providerData[0].providerId === 'google.com') {
      const confirm = window.confirm('Are you sure to Delete your account?');
      if (confirm) {
        try {
          setIsLoading(true);
          await signInWithPopup(auth, gProvider);
          toast.success('Re-authenticated!');
          await deleteDoc(doc(db, "users", auth.currentUser.uid)); 
          await deleteUser(auth.currentUser);
          dispatch(clearUser());
          setIsLoading(false);
          toast.success('Your Account is Deleted!');
        }
        catch (error) {
          setIsLoading(false);
          const errorMessage = error?.message;
          toast.error(errorMessage);
        }
      }
    }
    else if (auth.currentUser.providerData[0].providerId === 'facebook.com') {
      const confirm = window.confirm('Are you sure to Delete your account?');
      if (confirm) {
        try {
          setIsLoading(true);
          await signInWithPopup(auth, fbProvider);
          toast.success('Re-authenticated!');
          await deleteDoc(doc(db, "users", auth.currentUser.uid)); 
          await deleteUser(auth.currentUser);
          dispatch(clearUser());
          setIsLoading(false);
          toast.success('Your Account is Deleted!');
        }
        catch (error) {
          setIsLoading(false);
          const errorMessage = error?.message;
          toast.error(errorMessage);
        }
      }
    }
    else {
      setDeleteConfirm(true);
    }
  }

  async function handleDelete() {
    if (!pass) {
      toast.warning('Please provide your password to proceed!');
      return;
    }
    const confirm = window.confirm('Are you sure to Delete your account?');
    if (confirm) {
      setIsLoading(true);
      try {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          pass
        )

        await reauthenticateWithCredential(auth.currentUser, credential);
        toast.success('Re-authenticated!')
        await deleteDoc(doc(db, "users", auth.currentUser.uid)); 
        await deleteUser(auth.currentUser);
        dispatch(clearUser());
        setIsLoading(false);
        toast.success('Your Account is Deleted!');
      }
      catch (err) {
        console.log(err);
        setIsLoading(false);
        toast.error(err);
      }
    }
  }

  return (
    <PageTransition>
      {
        isLoading ?
          <Loader />
          :
          <div className='signUpInCard signinCard'>
            {
              deleteConfirm ?
                <div className='accountDeleteSection'>
                  <p>Confirm your password to delete.</p>
                  <Input type={'password'} value={pass} setValue={setPass} placeholder={'Password'} required={true} />
                  <DeleteIcon onClick={handleDelete} className='dltIcon' />
                </div>
                :
                <div>
                  <DpInput previewDp={previewDp} handleChange={handleChange} />

                  <Input type={'text'} value={userName} setValue={setUserName} placeholder={'Full Name'} required={true} />

                  <Button text={'Confirm'} onclickHandle={handleConfirm} stretched={true} />

                  {
                    (auth.currentUser.providerData[0].providerId !== 'facebook.com' && auth.currentUser.providerData[0].providerId !== 'google.com') &&
                    <Link className='changePassLink' to={`/${auth.currentUser.uid}/changePassword`} >Change Password</Link>
                  }

                  <p className='delete' onClick={googleOrFbCheck}><DeleteIcon className='dltIcon' /> Delete Account</p>
                </div>
            }
          </div>
      }
    </PageTransition>
  )
}

export default EditProfile