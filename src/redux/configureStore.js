import { createStore, combineReducers, applyMiddleware } from "redux";
import { Auth } from "./auth";
import { User } from "./user";
import { Users } from "./usersget";
import { Signup } from "./signup";
import { Start } from "./start";
import { Inbox } from './inbox';
import { Settings } from "./settings";
import { Notifications } from './notification';
import { Followers } from './followers';
import { Following } from './following';
import { Imagen } from './imagen';
import { Likes } from './likes';
import { Story } from './story';
import thunk from "redux-thunk";
import logger from "redux-logger";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      auth: Auth,
      user: User,
      users: Users,
      signup: Signup,
      inbox: Inbox,
      start: Start,
      setings: Settings,
      notifications: Notifications,
      followers: Followers,
      following: Following,
      imagen: Imagen,
      likes: Likes,
      story: Story
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
};
