// src/models/FunctionsModel.ts
import { makeAutoObservable } from 'mobx';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';
import { AppModel } from './AppModel';
import { Scenario } from './DataModel';

export class FunctionsModel {
  isLoading = false;
  error: string | null = null;

  constructor(private appModel: AppModel) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Add a new scenario
  async addScenario(scenarioText: string): Promise<Scenario> {
    this.isLoading = true;
    this.error = null;

    try {
      const addScenarioFunction = httpsCallable(functions, 'addScenario');
      const result = await addScenarioFunction({ scenarioText });

      const scenario = result.data as Scenario;

      // Add the new scenario to the list of scenarios
      this.appModel.dataModel.scenarios.push(scenario);

      return scenario;
    } catch (error) {
      this.error = (error as Error).message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Vote on a scenario
  async voteOnScenario(
    acceptedId: string,
    rejectedId: string,
  ): Promise<{
    acceptedRating: number;
    rejectedRating: number;
  }> {
    this.isLoading = true;
    this.error = null;

    try {
      const voteOnScenarioFunction = httpsCallable(functions, 'voteOnScenario');
      const result = await voteOnScenarioFunction({
        acceptedId,
        rejectedId,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.data as any;
    } catch (error) {
      this.error = (error as Error).message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  removeScenario(scenarioId: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const removeScenarioFunction = httpsCallable(functions, 'removeScenario');

      this.appModel.dataModel.scenarios = this.appModel.dataModel.scenarios.filter(
        (scenario) => scenario.id !== scenarioId,
      );

      return removeScenarioFunction({ scenarioId });
    } catch (error) {
      this.error = (error as Error).message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}
