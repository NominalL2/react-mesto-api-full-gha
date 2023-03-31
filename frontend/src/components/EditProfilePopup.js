import PopupWithForm from "./PopupWithForm.js";
import { useContext, useEffect, useState, } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext.js";

function EditProfilePopup(props) {
    const currentUser = useContext(CurrentUserContext);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeStatus(e) {
        setStatus(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onUpdateUser({
            name: name,
            about: status,
        });
    }

    useEffect(() => {
        if (props.isOpen) {
        setName(currentUser.name);
        setStatus(currentUser.about);
        }
    }, [currentUser, props.isOpen]);

    return (
        <PopupWithForm name="profile" title="Редактировать профиль" buttonName="Сохранить" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
            <input value={name || ''} onChange={handleChangeName} id="name-input" type="text" name="name" className="popup__input popup__input_name" minLength="2"
                maxLength="40" required />
            <span className="name-input-error popup__name-input-error"></span>
            <input value={status || ''} onChange={handleChangeStatus} id="status-input" type="text" name="status" className="popup__input popup__input_status" minLength="2"
                maxLength="200" required />
            <span className="status-input-error popup__status-input-error"></span>
        </PopupWithForm>
    )
}

export default EditProfilePopup;