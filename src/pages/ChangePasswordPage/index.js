import React, { useState } from 'react'
import Loader from '../../components/common/Loading';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../Redux/slices/usersSlice';
import PageTransition from '../../PageTransition';

function ChangePassword() {
    const [currentpass, setCurrentPass] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleChangePass() {
        if (!currentpass && !pass && !confirmPass) {
            toast.warning('Please fill up the details!');
            return;
        }
        if (pass.length < 8) {
            toast.warning('Password is too short!');
            return;
        }
        if (pass !== confirmPass) {
            toast.warning("Passwords doesn't match!");
            return;
        }
        try {
            setIsLoading(true);
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                currentpass
            )

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, pass);
            toast.success('Password Changed!');
            await signOut(auth);
            dispatch(clearUser());
            setIsLoading(false)
            navigate('/signin');
        }
        catch (err) {
            toast.error(err.message);
            console.log(err);
            setIsLoading(false);
        }
    }

    return (
        <PageTransition>
            {
                isLoading ?
                    <Loader />
                    :
                    <div className='signUpInCard signinCard'>
                        <h1 className='signUpInHeading'>Change Password</h1>

                        <div>
                            <Input type={'password'} value={currentpass} setValue={setCurrentPass} placeholder={'old password'} required={true} />

                            <Input type={'password'} value={pass} setValue={setPass} placeholder={'new password'} required={true} />

                            <Input type={'password'} value={confirmPass} setValue={setConfirmPass} placeholder={'confirm password'} required={true} />

                            <Button text={'Change'} onclickHandle={handleChangePass} stretched={true} />

                        </div>
                    </div>
            }
        </PageTransition>
    )
}

export default ChangePassword