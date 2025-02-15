// src/components/AuthButton.tsx
import React from 'react';
import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

export const AuthButton = observer(() => {
  const appModel = useAppModel();
  const { authModel } = appModel;

  if (authModel.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {authModel.isLoggedIn ? (
        <div>
          <p>Welcome, {authModel.currentUser?.email}</p>
          <button onClick={authModel.signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={authModel.signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
});
