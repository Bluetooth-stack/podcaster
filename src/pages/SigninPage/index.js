import React, { useState } from 'react'
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Redux/slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loading';
import PageTransition from '../../PageTransition';

function SigninPage() {
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const loggedInUser = useSelector((state)=>(state.user.user));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSignin() {
        if (mail === '' || pass === '') {
            toast.warn('Please fill up the credentials!');
            return;
        }
        try {
            setIsLoading(true);
            const userCred = await signInWithEmailAndPassword(auth, mail, pass);
            const user = userCred.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            dispatch(setUser({
                name: userData.name,
                email: user.email,
                uid: user.uid,
                // profile: fileUrl
            }))

            toast.success('Signed-in!')
            setIsLoading(false);
            navigate('/profile');
        }
        catch (err) {
            setIsLoading(false);
            toast.error(err?.message);
        }
    }

    return (
        <PageTransition>
            {
                isLoading ?
                    <Loader />
                    :
                    <div className='signUpInCard signinCard'>
                        <h1 className='signUpInHeading'>Signin</h1>

                        <div>
                            <Input type={'email'} value={mail} setValue={setMail} placeholder={'example@mail.com'} required={true} />

                            <Input type={'password'} value={pass} setValue={setPass} placeholder={'Password'} required={true} />

                            <Button text={'Signin'} onclickHandle={handleSignin} stretched={true} />

                            <p className='ifAccount'>Don't have an account? <Link to={'/signup'} className='toSignin'>Signup</Link></p>

                        </div>
                        <Link className='ifAccount' to={'/forgotPassword'}>Forgot Password?</Link>
                    </div>
            }
        </PageTransition>
    )
}

export default SigninPage