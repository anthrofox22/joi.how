import axios, { AxiosInstance } from 'axios';
import { ImageItem, ImageServiceType, ImageType } from '../types';
import {
  StashCredentials,
  StashSortOrder,
  stashSortOrderTags,
} from './StashProvider';

export type StashGender =
  | 'MALE'
  | 'FEMALE'
  | 'TRANSGENDER_MALE'
  | 'TRANSGENDER_FEMALE'
  | 'INTERSEX'
  | 'NON_BINARY';

export interface StashPerformer {
  id: string;
  name: string;
  gender: StashGender | null;
}

interface StashPerformersResponse {
  data: {
    findPerformers: {
      count: number;
      performers: Array<StashPerformer>;
    };
  };
}

export interface StashTag {
  id: string;
  name: string;
}

interface StashTagsResponse {
  data: {
    findTags: {
      count: number;
      tags: Array<StashTag>;
    };
  };
}

interface StashPostSearchResponse {
  data: {
    findScenes: {
      scenes: Array<{
        id: number;
        paths: {
          screenshot: string;
          preview: string;
          webp: string;
          stream: string;
        };
        files: {
          duration: number;
        };
      }>;
    };
  };
}

interface StashMarkersPostSearchResponse {
  data: {
    findSceneMarkers: {
      scene_markers: Array<{
        id: number;
        screenshot: string;
        preview: string;
        stream: string;
        scene: {
          id: number;
        };
        seconds: number;
      }>;
    };
  };
}

interface StashSceneFilter {
  performers?: {
    value: string[];
    excludes: string[];
    modifier: string;
  };
  tags?: {
    value: string[];
    excludes: string[];
    modifier: string;
  };
}

interface StashPostSearchRequest {
  query: string;
  limit: number;
  order: StashSortOrder;
  performer: string;
  tag: string;
  markersOnly: boolean;
  credentials?: StashCredentials;
  blacklist?: string[];
}

export class StashService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  async getImages(props: StashPostSearchRequest): Promise<ImageItem[]> {
    const { credentials, order, performer, tag, markersOnly, query, limit } =
      props;

    if (!credentials) {
      return [];
    }
    const correctedInstanceUrl = credentials.instanceUrl?.endsWith('/')
      ? credentials.instanceUrl.slice(0, -1)
      : credentials.instanceUrl;

    const sceneFilter: StashSceneFilter = {};
    if (performer) {
      sceneFilter.performers = {
        value: [performer],
        excludes: [],
        modifier: 'EQUALS',
      };
    }
    if (tag) {
      sceneFilter.tags = {
        value: [tag],
        excludes: [],
        modifier: 'INCLUDES',
      };
    }

    if (markersOnly) {
      const body = {
        operationName: 'FindSceneMarkers',
        variables: {
          filter: {
            q: query,
            page: 1,
            per_page: limit,
            sort: 'random',
            direction: 'ASC',
          },
          scene_marker_filter: sceneFilter,
        },
        query: `query FindSceneMarkers($filter: FindFilterType, $scene_marker_filter: SceneMarkerFilterType) {
                  findSceneMarkers(filter: $filter, scene_marker_filter: $scene_marker_filter) {
                    scene_markers {
                      id
                      screenshot
                      preview
                      stream
                      scene {
                        id
                      }
                      seconds
                    }
                  }
                }`,
      };

      const response =
        await this.axiosInstance.post<StashMarkersPostSearchResponse>(
          `${correctedInstanceUrl}/graphql`,
          body,
          {
            headers: {
              ApiKey: credentials.apiKey,
            },
          }
        );

      return response.data.data.findSceneMarkers.scene_markers.map(scene => ({
        thumbnail: `${scene.screenshot}?apikey=${credentials.apiKey}`,
        preview: `${scene.stream}?apikey=${credentials.apiKey}`,
        full: `${scene.stream}?apikey=${credentials.apiKey}`,
        type: ImageType.video,
        source: `${correctedInstanceUrl}/scenes/${scene.scene.id}?t=${scene.seconds}`,
        service: ImageServiceType.stash,
        randomStart: false,
        id: scene.id.toString(),
      }));
    }

    const [sort, direction] = stashSortOrderTags[order].split('_') as [
      string,
      string,
    ];
    const body = {
      operationName: 'FindScenes',
      variables: {
        filter: {
          q: query,
          page: 1,
          per_page: limit,
          sort: sort,
          direction: direction,
        },
        scene_filter: sceneFilter,
      },
      query: `query FindScenes($filter: FindFilterType, $scene_filter: SceneFilterType, $scene_ids: [Int!]) {
              findScenes(filter: $filter, scene_filter: $scene_filter, scene_ids: $scene_ids) {
                scenes {
                  id
                  paths {
                    screenshot
                    preview
                    webp
                    stream
                  }
                  files {
                    duration
                  }
                }
              }
            }`,
    };

    const response = await this.axiosInstance.post<StashPostSearchResponse>(
      `${correctedInstanceUrl}/graphql`,
      body,
      {
        headers: {
          ApiKey: credentials.apiKey,
        },
      }
    );

    return response.data.data.findScenes.scenes.map(scene => ({
      thumbnail: `${scene.paths.screenshot}&apikey=${credentials.apiKey}`,
      preview: `${scene.paths.preview}?apikey=${credentials.apiKey}`,
      full: scene.paths.stream,
      type: ImageType.video,
      source: `${correctedInstanceUrl}/scenes/${scene.id}`,
      service: ImageServiceType.stash,
      id: scene.id.toString(),
    }));
  }

  async getPerformers(
    credentials: StashCredentials
  ): Promise<StashPerformer[]> {
    const body = {
      operationName: 'FindPerformers',
      variables: {
        filter: {
          q: '',
          per_page: 200,
        },
      },
      query: `query FindPerformers($filter: FindFilterType, $performer_filter: PerformerFilterType, $performer_ids: [Int!]) {
                findPerformers(filter: $filter, performer_filter: $performer_filter, performer_ids: $performer_ids) {
                    count
                    performers {
                        id
                        name
                        gender
                    }
                }
            }`,
    };

    const correctedInstanceUrl = credentials.instanceUrl?.endsWith('/')
      ? credentials.instanceUrl.slice(0, -1)
      : credentials.instanceUrl;
    const response = await this.axiosInstance.post<StashPerformersResponse>(
      `${correctedInstanceUrl}/graphql`,
      body,
      {
        headers: {
          ApiKey: credentials.apiKey,
        },
      }
    );

    return response.data.data.findPerformers.performers;
  }

  async getTags(credentials: StashCredentials): Promise<StashTag[]> {
    const body = {
      operationName: 'FindTags',
      variables: {
        filter: {
          q: '',
          per_page: 200,
        },
      },
      query: `query FindTags($filter: FindFilterType, $tag_filter: TagFilterType) {
                findTags(filter: $filter, tag_filter: $tag_filter) {
                    count
                    tags {
                        id
                        name
                    }
                }
            }`,
    };

    const correctedInstanceUrl = credentials.instanceUrl?.endsWith('/')
      ? credentials.instanceUrl.slice(0, -1)
      : credentials.instanceUrl;
    const response = await this.axiosInstance.post<StashTagsResponse>(
      `${correctedInstanceUrl}/graphql`,
      body,
      {
        headers: {
          ApiKey: credentials.apiKey,
        },
      }
    );

    return response.data.data.findTags.tags;
  }

  async testCredentials(credentials: StashCredentials): Promise<boolean> {
    try {
      await this.getPerformers(credentials);
      return true;
    } catch (error) {
      return false;
    }
  }
}
