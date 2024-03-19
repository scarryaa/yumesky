import { AppBskyRichtextFacet, RichText as RichTextAPI } from '@atproto/api';
import React from 'react';
import agent from '../../api/agent';
import { Link } from 'react-router-dom';

interface RichTextProps {
  value: RichTextAPI | string;
}

const RichText: React.FC<RichTextProps> = ({ value }: RichTextProps) => {
  const richText = React.useMemo(() => value instanceof RichTextAPI ? value : new RichTextAPI({ text: value }), [value]);

  const { text, facets } = richText;

  if ((facets?.length) == null) {
    void richText.detectFacets(agent);

    return (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
    )
  }

  const els = [];
  let key = 0;
  for (const segment of richText.segments()) {
    const link = segment.link;
    const mention = segment.mention;
    const tag = segment.tag;

    if ((mention != null) && AppBskyRichtextFacet.isMention(mention)) {
      els.push(<Link key={key} to={`/profile/${mention.did}`}>{segment.text}</Link>)
    } else if ((link != null) && AppBskyRichtextFacet.isLink(link)) {
      els.push(<a key={key} href={link.uri} onClick={e => { e.preventDefault(); window.open(link.uri); }}>{segment.text}</a>)
    } else if ((tag != null) && AppBskyRichtextFacet.isTag(tag)) {
      els.push(<Link key={key} to={`/hashtag/${tag.tag}`}>{segment.text}</Link>)
    } else {
      els.push(segment.text);
    }

    key++;
  }

  return (<div style={{ whiteSpace: 'pre-wrap' }}>{els}</div>)
}

export default RichText;
