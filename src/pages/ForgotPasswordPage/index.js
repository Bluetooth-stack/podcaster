import React, { useState } from 'react'
import Loader from '../../components/common/Loading';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import PageTransition from '../../PageTransition';

function ForgotPassword() {
    const [mail, setMail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleReset() {
        try {
            setIsLoading(true);
            await sendPasswordResetEmail(auth, mail);
            setIsLoading(false);
            toast.success('E-mail sent!');
        }
        catch (error) {
            console.log(error.code);
            const errorMessage = error.message;
            setIsLoading(false);
            toast.error(errorMessage);
        };
    }

    return (
        <PageTransition>
            {
                isLoading ?
                    <Loader />
                    :
                    <div className='signUpInCard signinCard'>
                        <h1 className='signUpInHeading'>Reset Password</h1>
                        <p className='reset-info'>Password reset link will be sent to your E-mail.</p>
                        <div>
                            <Input type={'email'} value={mail} setValue={setMail} placeholder={'registered e-mail'} required={true} />

                            <Button text={'Send'} onclickHandle={handleReset} stretched={true} />
                        </div>
                        <Link className='ifAccount' to={'/signin'} style={{marginTop: '1rem'}}>Back to Signin</Link>
                    </div>
            }
        </PageTransition>
    )
}

export default ForgotPassword