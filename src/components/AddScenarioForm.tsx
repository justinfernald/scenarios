// src/components/AddScenarioForm.tsx
import React, { useState } from 'react';
import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';
import { Button, TextField } from '@mui/material';
import { FlexColumn } from './base/Flex';
import { flex1, fullWidth, padding } from '../styles';

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
    <FlexColumn css={[padding('md'), { width: 'min(calc(100% - 10px), 600px)' }]}>
      <form onSubmit={handleSubmit} css={[fullWidth, { display: 'flex', gap: '10px' }]}>
        <TextField
          css={[flex1]}
          type="text"
          value={scenarioText}
          onChange={(e) => setScenarioText(e.target.value)}
          placeholder="Enter a scenario"
          required
          multiline
          color={
            scenarioText.length > 0 && scenarioText.length < 10 ? 'error' : 'primary'
          }
        />
        <Button
          variant="text"
          type="submit"
          disabled={functionsModel.isLoading || scenarioText.length < 10}
        >
          {functionsModel.isLoading ? 'Adding...' : 'Add Scenario'}
        </Button>
      </form>
    </FlexColumn>
  );
});
