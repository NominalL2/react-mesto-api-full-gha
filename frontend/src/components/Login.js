import { useState } from 'react';
import '../index.css';
import FormForEntrance from './FormForEntrance.js';


function Login(props) {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onLogin(password, email)
    }

    return (
        <>
            <section className='sign'>
                <FormForEntrance 
                title='Вход'
                onSubmit={handleSubmit} 
                changeEmail={handleChangeEmail} 
                changePassword={handleChangePassword}
                valueEmail={email}
                valuePassword={password}
                buttonTitle='Войти'
                />
            </section>
        </>
    )
}

export default Login;