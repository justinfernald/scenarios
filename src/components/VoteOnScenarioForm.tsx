// src/components/VoteOnScenarioForm.tsx
import React, { useState } from 'react';
import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

export const VoteOnScenarioForm = observer(() => {
  const appModel = useAppModel();
  const { functionsModel } = appModel;
  const [scenarioAId, setScenarioAId] = useState('');
  const [scenarioBId, setScenarioBId] = useState('');
  const [chosenScenarioId, setChosenScenarioId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await functionsModel.voteOnScenario(scenarioAId, scenarioBId, chosenScenarioId);
      alert('Vote recorded successfully!');
      setScenarioAId('');
      setScenarioBId('');
      setChosenScenarioId('');
    } catch (error) {
      alert(`Error: ${functionsModel.error}`);
    }
  };

  return (
    <div>
      <h2>Vote on Scenario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={scenarioAId}
          onChange={(e) => setScenarioAId(e.target.value)}
          placeholder="Scenario A ID"
          required
        />
        <input
          type="text"
          value={scenarioBId}
          onChange={(e) => setScenarioBId(e.target.value)}
          placeholder="Scenario B ID"
          required
        />
        <input
          type="text"
          value={chosenScenarioId}
          onChange={(e) => setChosenScenarioId(e.target.value)}
          placeholder="Chosen Scenario ID"
          required
        />
        <button type="submit" disabled={functionsModel.isLoading}>
          {functionsModel.isLoading ? 'Voting...' : 'Vote'}
        </button>
      </form>
      {functionsModel.error && <p style={{ color: 'red' }}>{functionsModel.error}</p>}
    </div>
  );
});
