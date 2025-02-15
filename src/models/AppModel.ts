// src/models/AppModel.ts
import { makeAutoObservable } from 'mobx';
import { AuthModel } from './AuthModel';
import { FunctionsModel } from './FunctionsModel';
import { createContext, useContext } from 'react';

export class AppModel {
  authModel: AuthModel;
  functionsModel: FunctionsModel;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.authModel = new AuthModel();
    this.functionsModel = new FunctionsModel();
  }
}

export const AppModelContext = createContext<AppModel | null>(null);

export const useAppModel = () => {
  const appModel = useContext(AppModelContext);
  if (!appModel) {
    throw new Error('AppModel not found');
  }
  return appModel;
};
