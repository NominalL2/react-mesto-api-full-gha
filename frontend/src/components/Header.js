import '../index.css';

function Header(props) {

    return (
        <header className="header">
            <div className="header__logo"></div>
            <div className="header__info">
            {props.loggedIn && <p className="header__email">{props.info.email}</p>}
            <button onClick={props.onButtonClick} className={`header__button ${props.loggedIn && `header__button_exit`}`}>{props.info.title}</button>
            </div>
        </header>
    );
}

export default Header;