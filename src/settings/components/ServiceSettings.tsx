import styled from 'styled-components';
import { SettingsTile, TabBar } from '../../common';
import { E621Search } from '../../e621';
import { useState } from 'react';
import { WalltalkerSearch } from '../../walltalker';
import { StashSearch } from '../../stash';

const TabSettingsTile = styled(SettingsTile)`
  & > legend {
    background: var(--card-background);
    padding: 0;
  }
`;

export const ServiceSettings = () => {
  const [activeTab, setActiveTab] = useState<'e621' | 'stash' | 'walltalker'>(
    'e621'
  );

  return (
    <TabSettingsTile
      label={
        <TabBar
          tabs={[
            { id: 'e621', content: 'e621' },
            { id: 'stash', content: 'Stash' },
            // { id: 'walltalker', content: 'Walltalker' },
          ]}
          current={activeTab}
          onChange={id => setActiveTab(id as 'e621' | 'walltalker')}
        />
      }
    >
      {activeTab === 'e621' && <E621Search />}
      {activeTab === 'stash' && <StashSearch />}
      {activeTab === 'walltalker' && <WalltalkerSearch />}
    </TabSettingsTile>
  );
};
