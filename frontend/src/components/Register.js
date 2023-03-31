import { useState } from 'react';
import '../index.css';
import FormForEntrance from './FormForEntrance.js';


function Register(props) {
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

        console.log(password);
        console.log(email);
        props.onRegister(password, email)
    }

    return (
        <>
            <section className='sign'>
            <FormForEntrance 
                title='Регистрация'
                onSubmit={handleSubmit} 
                changeEmail={handleChangeEmail} 
                changePassword={handleChangePassword}
                valueEmail={email}
                valuePassword={password}
                buttonTitle='Зарегистрироваться'
                />
                <a href='/sign-in' className='sign__link'>Уже зарегистрированы? Войти</a>
            </section>
        </>
    )
}

export default Register;