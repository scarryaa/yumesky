interface Config {
  DEFAULT_HOME_TABS: { TABS: string[], GENERATORS: string[] };
  DEFAULT_PROFILE_TABS: { TABS: string[], GENERATORS: string[] };
}

const config: Config = {
  DEFAULT_HOME_TABS: {
    TABS: ['Following', 'Discover'],
    GENERATORS: ['', 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot']
  },
  DEFAULT_PROFILE_TABS: {
    TABS: ['Posts', 'Replies', 'Media', 'Feeds', 'Lists', 'Likes'],
    GENERATORS: []
  }
}

export default config;
