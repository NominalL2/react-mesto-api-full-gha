import '../index.css';

function PopupWithForm(props) {
  return (
    <section className={`popup ${props.isOpen && 'popup_opened'}`} id={`popup__${props.name}`}>
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={props.onClose}></button>
        <h2 className="popup__title">{props.title}</h2>
        <form className="popup__form" name={`${props.name}-popup`} onSubmit={props.onSubmit}>
          {props.children}
          <button type="submit" name="add" className="popup__submit-button">{props.buttonName}</button>
        </form>
      </div>
    </section>
  )
}

export default PopupWithForm;