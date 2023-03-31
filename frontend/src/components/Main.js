import '../index.css';
import { useContext } from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../context/CurrentUserContext.js';
import { CurrentCardsContext } from '../context/CurrentCardsContext.js';


function Main(props) {
    const profileInfo = useContext(CurrentUserContext);
    const cards = useContext(CurrentCardsContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__overlay" onClick={props.onEditAvatar}>
                    <img src={profileInfo.avatar} className="profile__avatar" alt="аватарка" />
                    <div className="profile__avatar-edit"></div>
                </div>
                <div className="profile__info">
                    <h1 className="profile__name">{profileInfo.name}</h1>
                    <button className="profile__edit-button" type="button" onClick={props.onEditProfile}></button>
                    <p className="profile__status">{profileInfo.about}</p>
                </div>
                <button className="profile__add-button" type="button" onClick={props.onAddPlace}></button>
            </section>
            <section className="elements">
                {cards.map((card) => (<Card card={card} onCardDel={props.onCardDel} onCardLike={props.onCardLike} currentUser={profileInfo} onOpenCard={props.onOpenCard} key={card._id} />))}

            </section>
        </main>
    );
}


export default Main;