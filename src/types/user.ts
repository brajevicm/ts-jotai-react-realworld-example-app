import axios from 'axios';
import { Decoder, nullable, object, string } from 'decoders';

export interface PublicUser {
  username: string;
  bio: string | null;
  image: string | null;
}

export interface User extends PublicUser {
  email: string;
  token: string;
}

export const userDecoder: Decoder<User> = object({
  email: string,
  token: string,
  username: string,
  bio: nullable(string),
  image: nullable(string),
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
}

export interface UserForRegistration {
  username: string;
  email: string;
  password: string;
}

export function loadUserIntoApp(user: User) {
  // const [_, loadUser] = useAtom(loadUserAtom);

  localStorage.setItem('token', user.token);
  axios.defaults.headers.Authorization = `Token ${user.token}`;
  // loadUser();
  // store.dispatch(loadUser(user));
}
