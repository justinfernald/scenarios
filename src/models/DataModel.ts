import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { flowResult, makeAutoObservable, runInAction, toJS } from 'mobx';

export interface Scenario {
  id?: string;
  scenarioText: string;
  rating: number;
  timesShown: number;
  timesChosen: number;
  createdBy: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export class DataModel {
  scenarios: Scenario[] = [];

  get rankingMap() {
    const sortedScenarios = toJS(this.scenarios).sort((a, b) => b.rating - a.rating);

    const rankingMap = new Map<string, number>();

    sortedScenarios.forEach((scenario, index) => {
      rankingMap.set(scenario.id!, index + 1);
    });

    return rankingMap;
  }

  constructor() {
    this.fetchScenarios();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchScenarios() {
    const scenarios = await fetchAllScenarios();

    console.log('Fetched Scenarios:', scenarios);

    runInAction(() => {
      this.scenarios = scenarios;
    });
  }
}

async function fetchAllScenarios(): Promise<Scenario[]> {
  try {
    const scenariosCollection = collection(db, 'scenarios');
    const snapshot = await getDocs(scenariosCollection);

    if (snapshot.empty) {
      throw new Error('No scenarios found.');
    }

    const scenarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Scenario[];

    return scenarios;
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    throw error;
  }
}

// const filterScenarios = (
//   scenarios: Scenario[],
//   options: {
//     ratingMin?: number;
//     ratingMax?: number;
//     timesChosenMin?: number;
//     timesChosenMax?: number;
//     createdAfter?: number;
//     createdBefore?: number;
//   },
// ) => {
//   const {
//     ratingMin,
//     ratingMax,
//     timesChosenMin,
//     timesChosenMax,
//     createdAfter,
//     createdBefore,
//   } = options;

//   return scenarios.filter((scenario) => {
//     // Filter by rating
//     if (ratingMin !== undefined && scenario.rating < ratingMin) return false;
//     if (ratingMax !== undefined && scenario.rating > ratingMax) return false;

//     // Filter by timesChosen
//     if (timesChosenMin !== undefined && scenario.timesChosen < timesChosenMin)
//       return false;
//     if (timesChosenMax !== undefined && scenario.timesChosen > timesChosenMax)
//       return false;

//     // Filter by createdAt (time created)
//     if (createdAfter !== undefined) {
//       const createdAt = scenario.createdAt?.toDate(); // Convert Firestore Timestamp to Date
//       if (!createdAt || createdAt < new Date(createdAfter)) return false;
//     }
//     if (createdBefore !== undefined) {
//       const createdAt = scenario.createdAt?.toDate(); // Convert Firestore Timestamp to Date
//       if (!createdAt || createdAt > new Date(createdBefore)) return false;
//     }

//     return true;
//   });
// };
