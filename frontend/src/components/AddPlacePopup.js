import PopupWithForm from "./PopupWithForm.js";
import { useEffect, useState } from "react";

function AddPlacePopup(props) {
    const [cardName, setCardName] = useState('');
    const [cardLink, setCardLink] = useState('');

    function handleChangeCardName(e) {
        setCardName(e.target.value)
    }

    function handleChangeCardLink(e) {
        setCardLink(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onAddCard({ name: cardName, link: cardLink, });
    }

    useEffect(() => {
        if (props.isOpen) {
            setCardName('');
            setCardLink('');
        }
    }, [props.isOpen])

    return (
        <PopupWithForm name="add" title="Новое место" buttonName="Создать" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
            <input value={cardName} onChange={handleChangeCardName} id="card-name-input" type="text" name="card-name" placeholder="Название"
                className="popup__input popup__input_card-name" minLength="2" maxLength="30" required />
            <span className="card-name-input-error popup__card-name-input-error"></span>
            <input value={cardLink} onChange={handleChangeCardLink} id="card-src-input" type="url" name="card-src" placeholder="Ссылка на картинку"
                className="popup__input popup__input_card-src" required />
            <span className="card-src-input-error popup__card-src-input-error"></span>
        </PopupWithForm>
    )
}

export default AddPlacePopup;