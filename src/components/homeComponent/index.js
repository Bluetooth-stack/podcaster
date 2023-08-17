import React from 'react';
import homePic from '../../Assets/homePic.png';
import './style.css';
import Button from '../common/Button'
import { useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();

    function onclickSignup(){
        navigate('/signup')
    }

    function onclickSignin(){
        navigate('/signin')
    }

    return (
        <section className='mainContainer'>
            <div className='info'>
                <h2 className='title'>
                    Discover better insight every single day
                </h2>
                <p>
                    Start creating your own audio podcasts while discovering latest top-notch stories & informative podcasts from world-wide creators. <span>Jump on air !</span> and boost your knowledge.
                </p>
                <div className='btnContainer'>
                    <Button text={'Signup'} onclickHandle={onclickSignup}/>
                    <Button text={'Signin'} onclickHandle={onclickSignin} outlined={true} />
                </div>
            </div>

            <div className='imageContainer'>
                <img src={homePic} alt="listening to podcast" />
            </div>
        </section>
    )
}

export default Main