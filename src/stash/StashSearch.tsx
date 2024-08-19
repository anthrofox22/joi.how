import styled from 'styled-components';
import {
  Dropdown,
  Measure,
  SettingsLabel,
  Slider,
  Space,
  TextInput,
  SettingsInfo,
  Spinner,
  Button,
  SettingsDescription,
  IconButton,
  Surrounded,
  ToggleTile,
  ToggleTileType,
} from '../common';
import { useCallback, useMemo, useState } from 'react';
import { StashService } from './StashService';
import { useImages } from '../settings';
import {
  StashSortOrder,
  stashSortOrderLabels,
  useStashSetting,
} from './StashProvider';
import { StashCredentialsInput } from './StashCredentials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faSync } from '@fortawesome/free-solid-svg-icons';

const StyledStashSearch = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
`;

export const StashSearch = () => {
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useStashSetting('search');
  const [limit, setLimit] = useStashSetting('limit');
  const [order, setOrder] = useStashSetting('order');
  const [performer, setPerformer] = useStashSetting('performer');
  const [performers, setPerformers] = useStashSetting('performers');
  const [markersOnly, setMarkersOnly] = useStashSetting('markersOnly');
  const [tag, setTag] = useStashSetting('tag');
  const [tags, setTags] = useStashSetting('tags');
  const [credentials, setCredentials] = useStashSetting('credentials');

  const setImages = useImages()[1];
  const stashService = useMemo(() => new StashService(), []);

  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await stashService.getImages({
        query,
        limit,
        order,
        performer,
        tag,
        markersOnly,
        credentials,
      });
      setImages(images => [
        ...result.filter(image => !images.some(i => i.id === image.id)),
        ...images,
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    stashService,
    query,
    limit,
    order,
    performer,
    tag,
    markersOnly,
    credentials,
    setImages,
  ]);

  const performersOptions = useMemo(() => {
    const performerOptions = Object.values(performers ?? []).map(
      ({ id, name, gender }) => ({
        value: id,
        label: `${name}${
          gender
            ? ` (${gender
                .split('_')
                .map(g => g.toLowerCase())
                .join(' ')})`
            : ''
        }`,
      })
    );

    return [
      {
        value: '',
        label: 'All',
      },
      ...performerOptions,
    ];
  }, [performers]);

  const tagsOptions = useMemo(() => {
    const tagOptions = Object.values(tags ?? []).map(({ id, name }) => ({
      value: id,
      label: name,
    }));

    return [
      {
        value: '',
        label: 'All',
      },
      ...tagOptions,
    ];
  }, [tags]);

  return (
    <StyledStashSearch>
      <SettingsDescription>Add videos from stash</SettingsDescription>
      <Surrounded
        trailing={
          <>
            <IconButton
              style={{ fontSize: '1rem' }}
              tooltip='Refresh performers and tags from Stash'
              onClick={
                credentials
                  ? () => {
                      stashService
                        .getPerformers(credentials)
                        .then(setPerformers);

                      stashService.getTags(credentials).then(setTags);
                    }
                  : undefined
              }
              icon={<FontAwesomeIcon icon={faSync} />}
            />
            <IconButton
              style={{ fontSize: '1rem' }}
              tooltip='Remove credentials'
              onClick={() => setCredentials(undefined)}
              icon={<FontAwesomeIcon icon={faRemove} />}
            />
          </>
        }
      >
        <SettingsInfo>Credentials</SettingsInfo>
      </Surrounded>
      <StashCredentialsInput
        service={stashService}
        onSaved={credentials => {
          setCredentials(credentials);
          if (!performers || !performers.length) {
            stashService.getPerformers(credentials).then(setPerformers);
          }
          if (!tags || !tags.length) {
            stashService.getTags(credentials).then(setTags);
          }
        }}
        initialValue={credentials}
        disabled={loading}
      />
      {credentials && (
        <>
          <SettingsInfo>
            <p style={{ display: 'inline' }}>
              You have logged in to Stash hosted at{' '}
              <strong>{credentials.instanceUrl}</strong>
            </p>
          </SettingsInfo>
          <Space size='medium' />
          <SettingsLabel htmlFor='query'>Search Query</SettingsLabel>
          <TextInput
            id='query'
            value={query}
            onChange={setQuery}
            onSubmit={runSearch}
            placeholder='Enter search query...'
            style={{ gridColumn: '2 / -1' }}
            disabled={loading}
          />
          <Space size='medium' />
          <SettingsLabel htmlFor='order'>Performer</SettingsLabel>
          <Dropdown
            id='performer'
            value={performer}
            onChange={(value: string) => setPerformer(value)}
            options={performersOptions}
            style={{ gridColumn: '2 / -1' }}
            disabled={loading}
          />
          <Space size='medium' />
          <SettingsLabel htmlFor='order'>Tag</SettingsLabel>
          <Dropdown
            id='tag'
            value={tag}
            onChange={(value: string) => setTag(value)}
            options={tagsOptions}
            style={{ gridColumn: '2 / -1' }}
            disabled={loading}
          />
          <Space size='medium' />
          <SettingsLabel htmlFor='order'>Order</SettingsLabel>
          <Dropdown
            id='order'
            value={order}
            onChange={(value: string) => setOrder(value as StashSortOrder)}
            options={Object.values(StashSortOrder).map(value => ({
              value,
              label: stashSortOrderLabels[value],
            }))}
            style={{ gridColumn: '2 / -1' }}
            disabled={loading}
          />
          <Space size='medium' />
          <SettingsLabel htmlFor='limit'>Count</SettingsLabel>
          <Slider
            id='limit'
            value={limit}
            onChange={setLimit}
            min={1}
            max={200}
            step={1}
          />
          <Measure value={limit} chars={3} unit='posts' />
          <Space size='medium' />
          <ToggleTile
            style={{ opacity: 1 }}
            type={ToggleTileType.check}
            value={markersOnly}
            onClick={() => setMarkersOnly(!markersOnly)}
          >
            <strong>Markers Only</strong>
            <p>Only add scenes with markers</p>
          </ToggleTile>
          <Space size='medium' />
          <Button
            onClick={runSearch}
            disabled={loading}
            style={{
              gridColumn: '1 / -1',
              justifySelf: 'center',
            }}
          >
            {loading ? <Spinner /> : <strong>Search & Add</strong>}
          </Button>
        </>
      )}
      <Space size='medium' />
    </StyledStashSearch>
  );
};
