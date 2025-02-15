import { MenuItem } from '@blueprintjs/core';
import { ItemRendererProps, MultiSelect } from '@blueprintjs/select';
import { ClassNames } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';

export interface MultiPlayerSelectorProps {
  players: Set<string>;
  selectedPlayers: Set<string>;
  setSelectedPlayers: (players: Set<string>) => void;
}

export const MultiPlayerSelector = observer((props: MultiPlayerSelectorProps) => {
  const { players, selectedPlayers, setSelectedPlayers } = props;

  const itemRenderer = useCallback(
    (player: string, { handleClick, modifiers }: ItemRendererProps) => {
      return (
        <MenuItem
          roleStructure="listoption"
          key={player}
          text={player}
          onClick={handleClick}
          active={modifiers.active}
          selected={selectedPlayers.has(player)}
        />
      );
    },
    [selectedPlayers],
  );

  const playerList = useMemo(() => Array.from(players), [players]);
  const selectedPlayersList = useMemo(
    () => Array.from(selectedPlayers),
    [selectedPlayers],
  );

  return (
    <ClassNames>
      {({ css }) => (
        <MultiSelect
          css={[{ width: 500 }]}
          items={playerList}
          selectedItems={selectedPlayersList}
          itemRenderer={itemRenderer}
          onItemSelect={(player) => {
            const newSelectedPlayers = new Set(selectedPlayers);

            if (!selectedPlayers.has(player)) {
              newSelectedPlayers.add(player);
            } else {
              newSelectedPlayers.delete(player);
            }

            setSelectedPlayers(newSelectedPlayers);
          }}
          tagRenderer={(player) => player}
          tagInputProps={{
            onRemove: (player, index) => {
              const newSelectedPlayers = new Set(selectedPlayers);

              newSelectedPlayers.delete(`${player}`);

              setSelectedPlayers(newSelectedPlayers);
            },
          }}
          itemsEqual={(a, b) => a === b}
          itemPredicate={(query, player) =>
            player.toLowerCase().includes(query.toLowerCase())
          }
          placeholder="Select players..."
          onClear={() => setSelectedPlayers(new Set())}
          resetOnSelect={true}
          popoverProps={{ minimal: true }}
          menuProps={{
            className: css({
              maxHeight: 500,
              overflowY: 'auto',
            }),
          }}
        />
      )}
    </ClassNames>
  );
});
