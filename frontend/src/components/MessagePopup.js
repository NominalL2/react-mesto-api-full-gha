import '../index.css';
import UnionSuccess from '../images/message_popuup/Union_success.png'
import UnionFail from '../images/message_popuup/Union_fail.png'

function MessagePopup(props) {
    return (
        <section className={`popup ${props.isOpen && 'popup_opened'}`} id={`popup__${props.name}`}>
            <div className="popup__container popup__container_message">
                <button className="popup__close" type="button" onClick={props.onClose}></button>
                <img className='popup__message-image' src={`${props.messageValue.logged ? UnionSuccess : UnionFail}`} />
                <h2 className="popup__title popup__title_message">{props.messageValue.title}</h2>
            </div>
        </section>
    )
}

export default MessagePopup;