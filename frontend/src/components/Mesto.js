import '../index.css';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';


function Mesto(props) {

    return (
        <>
            <Main onCardDel={props.onCardDel} onCardLike={props.onCardLike} onEditProfile={props.onEditProfile} onAddPlace={props.onAddPlace} onEditAvatar={props.onEditAvatar} onOpenCard={props.onOpenCard} />
            <Footer />
            <EditProfilePopup onUpdateUser={props.onUpdateUser} isOpen={props.isOpenEditProfile} onClose={props.onClose} />
            <AddPlacePopup onAddCard={props.onAddCard} isOpen={props.isOpenAdd} onClose={props.onClose} />
            <PopupWithForm name="del" title="Вы уверены?" buttonName="Да">
            </PopupWithForm>
            <EditAvatarPopup onUpdateAvatar={props.onUpdateAvatar} isOpen={props.isOpenEditAvatar} onClose={props.onClose} />
            <ImagePopup card={props.card} isOpen={props.isOpenCard} onClose={props.onClose} />
        </>
    );
}

export default Mesto;