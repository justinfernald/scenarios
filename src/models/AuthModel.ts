// src/models/AuthModel.ts
import { action, makeAutoObservable } from 'mobx';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export class AuthModel {
  user: User | null = null;
  isLoading = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initAuth();
  }

  // Initialize Firebase auth state listener
  initAuth() {
    onAuthStateChanged(
      auth,
      action((user: User | null) => {
        this.user = user;
        this.isLoading = false;
      }),
    );
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      this.isLoading = true;
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Sign out
  async signOut() {
    try {
      this.isLoading = true;
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Get the current user
  get currentUser() {
    return this.user;
  }

  // Check if the user is logged in
  get isLoggedIn() {
    return !!this.user;
  }
}
