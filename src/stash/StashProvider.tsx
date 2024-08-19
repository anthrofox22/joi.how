import { createLocalStorageProvider } from '../utils';
import { StashPerformer, StashTag } from './StashService';

export interface StashSettings {
  search: string;
  limit: number;
  order: StashSortOrder;
  performer: string;
  performers?: StashPerformer[];
  tag: string;
  tags?: StashTag[];
  markersOnly: boolean;
  credentials?: StashCredentials;
}

export interface StashCredentials {
  instanceUrl: string;
  apiKey: string;
}

export enum StashSortOrder {
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  DurationAsc = 'duration_ASC',
  DurationDesc = 'duration_DESC',
  Random = 'random_ASC',
}

export const stashSortOrderLabels: Record<StashSortOrder, string> = {
  [StashSortOrder.DateAsc]: 'Date (Oldest First)',
  [StashSortOrder.DateDesc]: 'Date (Newest First)',
  [StashSortOrder.DurationAsc]: 'Duration (Shortest First)',
  [StashSortOrder.DurationDesc]: 'Duration (Longest First)',
  [StashSortOrder.Random]: 'Random',
};

export const stashSortOrderTags: Record<StashSortOrder, string> = {
  [StashSortOrder.DateAsc]: 'date_ASC',
  [StashSortOrder.DateDesc]: 'date_DESC',
  [StashSortOrder.DurationAsc]: 'duration_ASC',
  [StashSortOrder.DurationDesc]: 'duration_DESC',
  [StashSortOrder.Random]: 'random_ASC',
};

const stashStorageKey = 'stash';

export const {
  Provider: StashProvider,
  useProvider: useStashSettings,
  useProviderSelector: useStashSetting,
} = createLocalStorageProvider<StashSettings>({
  key: stashStorageKey,
  defaultData: {
    search: '',
    limit: 75,
    order: StashSortOrder.Random,
    performer: '',
    performers: [],
    tag: '',
    tags: [],
    markersOnly: false,
  },
});
