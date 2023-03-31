import '../index.css';
import Header from './Header.js';
import MessagePopup from './MessagePopup.js'
import { useState, useEffect } from 'react';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../context/CurrentUserContext.js';
import { CurrentCardsContext } from '../context/CurrentCardsContext.js';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import Mesto from './Mesto.js';
import { auth } from '../utils/Auth.js'


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isMessagePopupOpen, setIsMessagePopupOpen] = useState(false);
  const [messagePopupValue, setMessagePopupValue] = useState({ logged: false, title: '' })
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [currentCards, setCurrentCards] = useState([]);
  const [headerInfo, setHeaderInfo] = useState({ link: '', title: '', email: '' });

  const handleEditAvatarClick = () => { setIsEditAvatarPopupOpen(true) };
  const handleEditProfileClick = () => { setIsEditProfilePopupOpen(true) };
  const handleAddPlaceClick = () => { setIsAddPlacePopupOpen(true) };
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsCardOpen(true);
  }
  const handleMessagePopupOpen = (logged, title) => {
    setMessagePopupValue({ logged: logged, title: title })
    setIsMessagePopupOpen(true)
  }

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsCardOpen(false);
    setIsMessagePopupOpen(false);
    setSelectedCard({});
  }

  function checkToken() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setHeaderInfo({ link: '/sign-in', title: 'Выйти', email: res.data.email })
            navigate('/mesto', setLoggedIn(true))
          }
        })
    }
  }

  function handleHeaderButton() {
    if (location.pathname === '/sign-in') {
      navigate('/sign-up');
      setHeaderInfo({ link: '/sign-in', title: 'Войти', email: '' })
    }
    else if (location.pathname === '/sign-up') {
      navigate('/sign-in');
      setHeaderInfo({ link: '/sign-up', title: 'Регистрация', email: '' })
    }
    else if (location.pathname === '/mesto') {
      navigate('/sign-in');
      setHeaderInfo({ link: '/sign-up', title: 'Регистрация' })
      localStorage.removeItem('jwt');
      setLoggedIn(false)
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCurrentCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err)
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCurrentCards((state) => state.filter(c => c._id !== card._id))
      })
      .catch((err) => {
        console.log(err)
      });
  }

  function handleUpdateUser({ name, about }) {
    api.sendProfileInfo(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar({ avatar }) {
    api.changeAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddCard({ name, link }) {
    api.sendCard(name, link)
      .then((res) => {
        setCurrentCards([res, ...currentCards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleRegister(password, email) {
    auth.register(password, email)
      .then(() => {
        navigate('/sign-in');
        setHeaderInfo({ title: 'Регистрация' })
        handleMessagePopupOpen(true, 'Вы успешно зарегистрировались!')
      })
      .catch(() => {
        handleMessagePopupOpen(false, 'Что-то пошло не так! Попробуйте ещё раз')
      })
  }

  function handleLogin(password, email) {
    auth.login(password, email)
      .then(() => {
        setHeaderInfo({ link: '/sign-in', title: 'Выйти', email: email })
        navigate('/mesto', setLoggedIn(true));
      })
      .catch(() => {
        handleMessagePopupOpen(false, 'Что-то пошло не так! Попробуйте ещё раз')
      })
  }

  useEffect(() => {
    if (loggedIn) {
      api.setProfileInfo()
        .then((res) => {
          setCurrentUser(res)
        })
        .catch((err) => {
          console.log(err)
        })

      api.initialCards()
        .then((res) => {
          setCurrentCards(res)
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn])

  useEffect(() => {
    checkToken();

    if (location.pathname === '/sign-in' || location.pathname === '/' && loggedIn === false) {
      setHeaderInfo({ link: '/sign-up', title: 'Регистрация', email: '' })
    }
    else if (location.pathname === '/sign-up') {
      setHeaderInfo({ link: '/sign-in', title: 'Войти', email: '' })
    }
    else if (location.pathname === '/mesto' || location.pathname === '/' && loggedIn === true) {
      setHeaderInfo({ link: '/sign-in', title: 'Выйти' })
    }
  }, [])

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>

        <CurrentCardsContext.Provider value={currentCards}>
          <div className='page'>
            <Header info={headerInfo} onButtonClick={handleHeaderButton} loggedIn={loggedIn} />
            <Routes>
              <Route path='/mesto' element={<ProtectedRouteElement
                element={Mesto}
                loggedIn={loggedIn}
                onCardDel={handleCardDelete}
                onCardLike={handleCardLike}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onOpenCard={handleCardClick}
                onUpdateUser={handleUpdateUser}
                isOpenEditProfile={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onAddCard={handleAddCard}
                isOpenAdd={isAddPlacePopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                isOpenEditAvatar={isEditAvatarPopupOpen}
                card={selectedCard}
                isOpenCard={isCardOpen}
              />} />
              <Route path='/sign-in' element={<Login onLogin={handleLogin} />} />
              <Route path='/sign-up' element={<Register onRegister={handleRegister} />} />
              <Route path="/" element={loggedIn ? <Navigate to="/mesto" replace /> : <Navigate to="/sign-in" replace />} />
            </Routes>
            <MessagePopup isOpen={isMessagePopupOpen} messageValue={messagePopupValue} onClose={closeAllPopups} />
          </div>
        </CurrentCardsContext.Provider>

      </CurrentUserContext.Provider>

    </>
  );
}

export default App;
