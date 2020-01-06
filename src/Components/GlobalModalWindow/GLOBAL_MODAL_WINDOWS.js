import React from "react";
//Подрубаем обертку модалок
import GlobalModalWindow from "./GlobalModalWindow";
//Подрубаем контент для модалок
import Registration from "../../Containers/Forms/Registration";
import Login from "../../Containers/Forms/Login";
import Profile from "../../Containers/Forms/Profile";

//Названия модальных окон
export const registration = "registration";
export const login = "login";
export const profile = "profile";

export function getGlobalModalWindow(modalWindowState, modalWindowName) {
  //Если показывать ничего не нужно — выйдем сразу
  if (modalWindowState === false) {
    return;
  }

  let modalWindowContent;

  switch (modalWindowName) {
    case registration:
      modalWindowContent = <Registration />;
      break;
    case login:
      modalWindowContent = <Login />;
      break;
    case profile:
      modalWindowContent = <Profile />;
      break;
    default:
      return;
  }
  return <GlobalModalWindow>{modalWindowContent}</GlobalModalWindow>;
}