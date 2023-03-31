function Card(props) {

    const isOwn = props.card.owner._id === props.currentUser._id;

    const isLiked = props.card.likes.some(i => i._id === props.currentUser._id);

    const cardLikeButtonClassName = (
        `element__like ${isLiked && 'element__like_active'}`
    );;

    const handleClick = () => {
        props.onOpenCard(props.card);
    }

    const handleLickeClick = () => {
        props.onCardLike(props.card);
    }

    const handleDelCard = () => {
        props.onCardDel(props.card);
    }

    return (

        <div className="element">
            <img src={props.card.link} className="element__image" alt={props.card.name} onClick={handleClick} />
            <div className="element__group">
                <h2 className="element__name">{props.card.name}</h2>
                <button className={cardLikeButtonClassName} type="button" onClick={handleLickeClick}></button>
                <div className="element__counter">{props.card.likes.length}</div>
                {isOwn && <button className="element__trash" type="button" onClick={handleDelCard}></button>}
            </div>
        </div>

    )
}

export default Card;