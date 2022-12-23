import { None, Option, Some } from '@hqoss/monads';
import { atom } from 'jotai';

import { User } from 'types/user';

export const userAtom = atom<Option<User>>(None);

export const userIsLoggedAtom = atom<boolean>((get) => get(userAtom).isSome());
export const userAsyncStatusAtom = atom<boolean>(true);

export const loadUserAtom = atom<null, User>(null, (get, set, user: User) => {
  set(userAtom, Some(user));
  set(userAsyncStatusAtom, false);
});

export const logout = atom<null, null>(null, (get, set) => {
  set(userAtom, None);
});
