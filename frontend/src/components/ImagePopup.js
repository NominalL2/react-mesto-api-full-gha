import '../index.css';

function ImagePopup(props) {
    return (
        <section className={`popup ${props.isOpen && 'popup_opened'}`} id="popup-card">
            <div className="popup__content-card">
                <img src={props.card.link} className="popup__image-card" />
                <p className="popup__caption-card">{props.card.name}</p>
                <button className="popup__close" type="button" onClick={props.onClose}></button>
            </div>
        </section>
    )
}

export default ImagePopup;