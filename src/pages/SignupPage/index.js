import React, { useState } from 'react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Link } from 'react-router-dom'
import { auth, db, gProvider, fbProvider, storage } from '../../firebase';
import { FacebookAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Redux/slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loading';
import defaultDp from '../../Assets/defaultDp.jpg';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import DpInput from '../../components/common/Input/DpInput';
import PageTransition from '../../PageTransition';


function Signup() {
    const [fullname, setFullname] = useState('');
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewDp, setpreviewDp] = useState(defaultDp);
    const [displayPic, setDisplayPic] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // function checkStrongPassword(passwordText) {
    //     const strong = /^[a-zA-Z0-9.#$'*+?_-]+@[a-zA-Z0-9-]+(?:\+)*$/;
    //     return passwordText.match(strong);
    // }
    function validateEmail(mailText) {
        var validRegex = /^[a-zA-Z0-9.#$'*+?_-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return validRegex.test(mailText);
    }

    async function handleSignup() {
        if (fullname === '' || mail === '' || pass === '' || confirmPass === '') {
            toast.warn('Please fill up the credentials!');
            return;
        }
        if (!validateEmail(mail)) {
            toast.warn('Please enter valid e-mail!')
            return;
        }
        if (pass.length < 8) {
            toast.warn('Your password too short!');
            return;
        }
        if (pass !== confirmPass) {
            toast.error("Passwords doesn't match!");
            return;
        }
        try {
            setIsLoading(true);
            const userCred = await createUserWithEmailAndPassword(auth, mail, pass);
            const user = userCred.user;
            let profileImgUrl = '';
            if (displayPic) {
                const profileImageRef = ref(
                    storage,
                    `userDisplayImage/${user.uid}/${Date.now()}`
                );

                await uploadBytes(profileImageRef, displayPic);

                profileImgUrl = await getDownloadURL(profileImageRef);
            }

            //seting into firebase db
            await setDoc(doc(db, 'users', user.uid), {
                name: fullname,
                email: user.email,
                uid: user.uid,
                profile: profileImgUrl,
            })

            await updateProfile(user, { displayName: fullname.toString(), photoURL: profileImgUrl });

            //setting into redux userSlice
            dispatch(setUser({
                name: fullname,
                email: user.email,
                uid: user.uid,
                profilePic: profileImgUrl
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

    async function handleGoogleAuth() {
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, gProvider)
            // The signed-in user info.
            const user = result.user;
            await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                profile: user.photoURL
            });

            dispatch(setUser({
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                profile: user.photoURL
            }))

            setIsLoading(false);
            toast.success('Signed-in!')
            navigate('/profile')
        }
        catch (error) {
            setIsLoading(false);
            const errorMessage = error?.message;
            toast.error(errorMessage);
        }
    }

    async function handleFbAuth() {
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, fbProvider)
            const user = result.user;

            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                profile: user.photoURL + `?access_token=${accessToken}`
            });

            await updateProfile(user, { photoURL: user.photoURL + `?access_token=${accessToken}` });

            dispatch(setUser({
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                profile: user.photoURL + `?access_token=${accessToken}`,
            }))
            setIsLoading(false);
            toast.success('Signed-in!')
            navigate('/profile')
        }
        catch (error) {
            setIsLoading(false);
            const errorMessage = error?.message;
            toast.error(errorMessage);
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
        <PageTransition>
            {
                isLoading ?
                    <Loader />
                    :
                    <div className='signUpInCard'>
                        <h1 className='signUpInHeading'>Signup</h1>

                        <div>
                            <DpInput previewDp={previewDp} handleChange={handleChange} />

                            <Input type={'text'} value={fullname} setValue={setFullname} placeholder={'Full Name'} required={true} />

                            <Input type={'email'} value={mail} setValue={setMail} placeholder={'example@mail.com'} required={true} />

                            <Input type={'password'} value={pass} setValue={setPass} placeholder={'Password'} required={true} />

                            <Input type={'password'} value={confirmPass} setValue={setConfirmPass} placeholder={'Confirm Password'} required={true} />

                            <Button text={'Signup'} onclickHandle={handleSignup} stretched={true} />

                            <p className='ifAccount'>Already have an account? <Link to={'/signin'} className='toSignin'>Signin</Link></p>

                            <div className='loginBtn withGoogle' onClick={handleGoogleAuth}>
                                <GoogleIcon className='authIcon' /> <span>Signin with Google</span>
                            </div>
                            <div className='loginBtn withFb' onClick={handleFbAuth}>
                                <FacebookIcon className='authIcon' /> <span>Signin with Facebook</span>
                            </div>
                        </div>
                    </div>
            }
        </PageTransition>
    )
}

export default Signup