// src/components/AddScenarioForm.tsx
import React, { useState } from 'react';
import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

export const AddScenarioForm = observer(() => {
  const appModel = useAppModel();
  const { functionsModel } = appModel;
  const [scenarioText, setScenarioText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await functionsModel.addScenario(scenarioText);
      setScenarioText('');
    } catch (error) {
      console.error(`Error: ${functionsModel.error}`);
    }
  };

  return (
    <div>
      <h2>Add Scenario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={scenarioText}
          onChange={(e) => setScenarioText(e.target.value)}
          placeholder="Enter a scenario"
          required
        />
        <button type="submit" disabled={functionsModel.isLoading}>
          {functionsModel.isLoading ? 'Adding...' : 'Add Scenario'}
        </button>
      </form>
      {functionsModel.error && <p style={{ color: 'red' }}>{functionsModel.error}</p>}
    </div>
  );
});
