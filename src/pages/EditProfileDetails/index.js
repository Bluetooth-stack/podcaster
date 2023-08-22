import React, { useEffect, useState } from 'react';
import Loader from '../../components/common/Loading';
import { auth, db, storage } from '../../firebase';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DefaultDp from '../../Assets/defaultDp.jpg'
import DpInput from '../../components/common/Input/DpInput';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { setUser } from '../../Redux/slices/usersSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(auth.currentUser.displayName);
  const [previewDp, setpreviewDp] = useState(auth.currentUser.photoURL ? auth.currentUser.photoURL : DefaultDp);
  const [displayPic, setDisplayPic] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.currentUser.providerData[0].providerId === 'facebook.com') {
      getProfilePic();
    }
  }, [])

  async function handleConfirm() {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      const profileImageRef = ref(
        storage,
        `userDisplayImage/${user.uid}/${Date.now()}`
      );

      await uploadBytes(profileImageRef, displayPic);

      const profileImgUrl = await getDownloadURL(profileImageRef);

      await updateProfile(auth.currentUser, {
        displayName: userName, photoURL: profileImgUrl
      })
      
      //setting into redux userSlice
      dispatch(setUser({
        name: userName,
        email: user.email,
        uid: user.uid,
        profile: profileImgUrl
      }))

      setIsLoading(false);
      toast.success('Signed-up!')
      navigate('/profile')
    }
    catch (err) {
      setIsLoading(false);
      toast.error(err?.message);
    }
  }

  async function getProfilePic() {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().profile);
        setpreviewDp(docSnap.data().profile)
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    catch (err) {
      console.log(err);
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

  return (
    <>
      {
        isLoading ?
          <Loader />
          :
          <div className='signUpInCard signinCard'>

            <div>
              <DpInput previewDp={previewDp} handleChange={handleChange} />

              <Input type={'text'} value={userName} setValue={setUserName} placeholder={'example@mail.com'} required={true} />

              <Button text={'Confirm'} onclickHandle={handleConfirm} stretched={true} />

            </div>
          </div>
      }
    </>
  )
}

export default EditProfile