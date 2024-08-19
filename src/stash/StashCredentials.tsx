import styled from 'styled-components';
import { StashService } from './StashService';
import { useCallback, useMemo, useState } from 'react';
import {
  SettingsInfo,
  SettingsLabel,
  Space,
  Spinner,
  TextInput,
} from '../common';
import { StashCredentials } from './StashProvider';

export interface StashCredentialsInputProps {
  service: StashService;
  initialValue?: Partial<StashCredentials>;
  onSaved?: (credentials: StashCredentials) => void;
  disabled?: boolean;
}

const StyledStashCredentialsInput = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: auto 1fr auto;
`;

const StyledStashSaveCredentials = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const StyledStashSaveCredentialsButton = styled.button`
  background: var(--button-background);
  color: var(--button-color);
  border-radius: var(--border-radius);
  padding: 4px 8px;
  transition:
    background 0.2s,
    opacity 0.2s;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: var(--primary);
  }
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

export const StashCredentialsInput = ({
  service,
  initialValue,
  onSaved,
  disabled,
}: StashCredentialsInputProps) => {
  const [input, setInput] = useState<Partial<StashCredentials>>({
    instanceUrl: '',
    apiKey: '',
    ...initialValue,
  });
  const [loading, setLoading] = useState(false);

  const onSave = useCallback(async () => {
    setLoading(true);
    const valid = await service.testCredentials(input as StashCredentials);
    if (valid) {
      onSaved?.(input as StashCredentials);
    }
    setLoading(false);
  }, [input, onSaved, service]);

  const hasData = useMemo(
    () => input?.instanceUrl && input?.apiKey,
    [input?.instanceUrl, input?.apiKey]
  );

  const locked = useMemo(() => loading || disabled, [loading, disabled]);

  return (
    <StyledStashCredentialsInput>
      <SettingsInfo>
        You must enter your hosted{' '}
        <a
          href='https://github.com/stashapp/stash'
          target='_blank'
          rel='noreferrer'
        >
          Stash
        </a>{' '}
        instance URL and API key. You can find your api key from the Settings
        -&gt; Security section of Stash.
      </SettingsInfo>
      <Space size='small' />
      <SettingsLabel>Instance URL</SettingsLabel>
      <TextInput
        style={{ gridColumn: '2 / -1' }}
        value={input?.instanceUrl}
        onChange={instanceUrl =>
          setInput({
            ...input,
            instanceUrl,
          })
        }
        placeholder='Instance URL'
        autoComplete='instanceUrl'
        disabled={locked}
      />
      <Space size='small' />
      <SettingsLabel>API Key</SettingsLabel>
      <TextInput
        style={{ gridColumn: '2 / -1' }}
        value={input?.apiKey}
        onChange={apiKey =>
          setInput({
            ...input,
            apiKey,
          })
        }
        placeholder='API Key'
        type='password'
        autoComplete='current-password'
        disabled={locked}
      />
      <Space size='small' />
      <StyledStashSaveCredentials>
        {loading && <Spinner />}
        <Space size='small' />
        <StyledStashSaveCredentialsButton
          onClick={!loading ? onSave : undefined}
          disabled={!hasData || locked}
        >
          Save
        </StyledStashSaveCredentialsButton>
      </StyledStashSaveCredentials>
    </StyledStashCredentialsInput>
  );
};
