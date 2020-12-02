import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import { CurrentUserContext } from '../contexts/currentUserContext';
import api from '../utils/api.js';
import * as auth from '../utils/auth.js';
import { renderError } from '../utils/utils.js';

function App() {
  const [currentUser, setCurrentUser] = React.useState({});

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isImageCardPopupOpen, setIsImageCardPopupOpen] = React.useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});

  const [cards, setCards] = React.useState([]);

  // --> авторизация
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(false);
  const [tooltipMessage, setTooltipMessage] = React.useState('');

  const history = useHistory();
  // <-- авторизация

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }


  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }


  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }


  function handleCardClick(card) {
    setSelectedCard({ ...card });
    setIsImageCardPopupOpen(true);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      // Обновляем стейт
      setCards(newCards);
    })
      .catch((err) => {
        renderError(`Ошибка: ${err}`);
      });
  }

  function handleCardDelete(event, card) {
    event.stopPropagation();
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.removeCard(card._id).then(() => {
      // Создаем копию массива, исключив из него удалённую карточку
      const newCards = cards.filter((c) => c._id !== card._id);
      // Обновляем стейт
      setCards(newCards);
    })
      .catch((err) => {
        renderError(`Ошибка: ${err}`);
      });
  }

  function handleUpdateUser({ name, about }) {
    api.changeUserInfo({ name, about }).then(data => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        renderError(`Ошибка: ${err}`);
      });

  }


  function handleUpdateAvatar({ avatar }) {
    api.changeAvatar({ avatar }).then(data => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        renderError(`Ошибка: ${err}`);
      });
  }


  function handleAddPlaceSubmit({ name, link }) {
    api.addNewCard({ name, link }).then((newCard) => {

      // Обновляем стейт карточек
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
      .catch((err) => {
        renderError(`Ошибка: ${err}`);
      });
  }

  function onOpenPopupInfoTooltip(status, message) {
    setIsRegisterSuccess(status);
    setTooltipMessage(message);
    setIsInfoTooltipPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setIsImageCardPopupOpen(false);
    setIsSubmitPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);

    setSelectedCard({});
  }

  // --> авторизация

  const onLogin = (email, password) => {
    // авторизация
    auth.authorize(email, password)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          setEmail(email);
          setLoggedIn(true);
        } else {
          return new Promise().reject();
        }
      })
      .catch((err) => {
        if (err.data) {
          onOpenPopupInfoTooltip(false, err.data.message);
        } else {
          onOpenPopupInfoTooltip(false, 'Что-то пошло не так');
        }
      });
  }

  const onRegister = (password, email) => {
    auth.register(password, email)
      .then((res) => {
        if (res.data.data.email) {
          history.push('./sign-in');
          onOpenPopupInfoTooltip(true, 'Вы успешно зарегистрировались!');

        } else {
          return new Promise().reject();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.data) {
          if (err.data.message) {
            onOpenPopupInfoTooltip(false, err.data.message);
          } else {
            onOpenPopupInfoTooltip(false, err.data.error);
          }
        } else {
          onOpenPopupInfoTooltip(false, 'Что-то пошло не так');
        }
      });
  }


  const tokenCheck = () => {

    const token = localStorage.getItem('token');

    if (token) {
      auth.getContent(token).then((res) => {
        if (res.data.data.email) {
          setEmail(res.data.data.email);
          setLoggedIn(true);
        } else {
          return new Promise().reject();
        }

      })
        .catch(_ => onOpenPopupInfoTooltip(false, 'Что-то пошло не так! Проблемы с токеном.'));
    }
  }


  const onSignOut = () => {
    // выход из профиля
    localStorage.removeItem('token');
    setEmail('');
    setLoggedIn(false);
  }
  // <-- авторизация

  React.useEffect(() => {
    api.getUserInfo().then((initialUserInfo) => {

      setCurrentUser(initialUserInfo);
    }
    )
      .catch((err) => console.error(err));
  }, []);

  React.useEffect(() => {
    api.getCardsFromServer().then((initialCardList) => {
      const cardList = initialCardList.map(card => card);
      setCards(cardList);
    })
      .catch((err) => console.error(err));
  }, []);

  // --> авторизация
  React.useEffect(_ => {
    tokenCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(_ => {
    if (loggedIn) {
      history.push('/');
    }
    // eslint-disable-next-line
  }, [loggedIn]);
  // <-- авторизация

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className='page'>
          <div className='page__container'>
            <Header
              loggedIn={loggedIn}
              email={email}
              onSignOut={onSignOut}
            />
            <Switch>
              <ProtectedRoute exact path="/"
                loggedIn={loggedIn}
                component={Main}
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete} />
              <Route path="/sign-in">
                <div className="loginContainer">
                  <Login onLogin={onLogin} />
                </div>
              </Route>
              <Route path="/sign-up">
                <div className="registerContainer">
                  <Register onRegister={onRegister} />
                </div>
              </Route>
              <Route>
                {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
              </Route>
            </Switch>
            <Footer />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />


            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />

            <PopupWithForm
              name='delete-submit'
              title='Вы уверены?'
              submitName='Да'
              isOpen={isSubmitPopupOpen}
              onClose={closeAllPopups}>
            </PopupWithForm>

            <ImagePopup
              name='img'
              isOpen={isImageCardPopupOpen}
              onClose={closeAllPopups}
              card={selectedCard}>
            </ImagePopup>

            <InfoTooltip
              name='infoToolLip'
              isOpen={isInfoTooltipPopupOpen}
              onClose={closeAllPopups}
              status={isRegisterSuccess}
              message={tooltipMessage}
            >
            </InfoTooltip>
          </div>
        </div>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
