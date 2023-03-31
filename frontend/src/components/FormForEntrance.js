import '../index.css';


function FormForEntrance(props) {
    return (
        <>
                <h2 className='sign__title'>{props.title}</h2>
                <form onSubmit={props.onSubmit} name='login' className='sign__form'>
                    <input value={props.valueEmail} onChange={props.changeEmail} type='email' name='email' placeholder='Email' className='sign__input sign__input_email' required></input>
                    <input value={props.valuePassword} onChange={props.changePassword} type='password' name='password' placeholder='Пароль' className='sign__input sign__input_password' minLength="5" required></input>
                    <button type='submit' name='sign-in' className='sign__button'>{props.buttonTitle}</button>
                </form>
        </>
    )
}

export default FormForEntrance;