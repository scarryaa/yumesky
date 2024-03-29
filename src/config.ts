export type DefaultProfileTabs = ['Posts', 'Replies', 'Media', 'Feeds', 'Lists', 'Likes'];
export type DefaultHomeTabs = ['Following', 'Discover'];
interface SharedConfig {
  DEFAULT_HOME_TABS: { TABS: DefaultHomeTabs, GENERATORS: string[] };
  DEFAULT_PROFILE_TABS: { TABS: DefaultProfileTabs, GENERATORS: string[] };
}

interface Config extends SharedConfig {
  DOMAIN: string;
}

const getConfig = (): Config => {
  // determine environment
  if ((process.env.NODE_ENV.length === 0) || process.env.NODE_ENV === 'development') {
    return devConfig;
  } else {
    return prodConfig;
  }
}

const sharedConfig: SharedConfig = {
  DEFAULT_HOME_TABS: {
    TABS: ['Following', 'Discover'],
    GENERATORS: ['', 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot']
  },
  DEFAULT_PROFILE_TABS: {
    TABS: ['Posts', 'Replies', 'Media', 'Feeds', 'Lists', 'Likes'],
    GENERATORS: []
  }
}

const devConfig: Config = {
  DOMAIN: 'localhost:3000',
  ...sharedConfig
}

const prodConfig: Config = {
  DOMAIN: 'https://scarryaa.github.io/yumesky',
  ...sharedConfig
}

export default getConfig;
