// src/models/FunctionsModel.ts
import { makeAutoObservable } from 'mobx';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';

export class FunctionsModel {
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Add a new scenario
  async addScenario(scenarioText: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const addScenarioFunction = httpsCallable(functions, 'addScenario');
      const result = await addScenarioFunction({ scenarioText });
      return result.data;
    } catch (error) {
      this.error = (error as Error).message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Vote on a scenario
  async voteOnScenario(
    scenarioAId: string,
    scenarioBId: string,
    chosenScenarioId: string,
  ) {
    this.isLoading = true;
    this.error = null;

    try {
      const voteOnScenarioFunction = httpsCallable(functions, 'voteOnScenario');
      const result = await voteOnScenarioFunction({
        scenarioAId,
        scenarioBId,
        chosenScenarioId,
      });
      return result.data;
    } catch (error) {
      this.error = (error as Error).message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}
