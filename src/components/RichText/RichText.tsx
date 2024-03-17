import { AppBskyRichtextFacet, RichText as RichTextAPI } from '@atproto/api';
import React from 'react';
import agent from '../../api/agent';

interface RichTextProps {
  value: RichTextAPI | string;
}

const RichText: React.FC<RichTextProps> = ({ value }: RichTextProps) => {
  const richText = React.useMemo(() => value instanceof RichTextAPI ? value : new RichTextAPI({ text: value }), [value])
  void richText.detectFacets(agent);
  const { text, facets } = richText;

  console.log(facets);
  if ((facets?.length) == null) {
    return (
        <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
    )
  }

  const els = [];
  for (const segment of richText.segments()) {
    const link = segment.link;
    const mention = segment.mention;
    const tag = segment.tag;

    if ((mention != null) && AppBskyRichtextFacet.validateMention(mention).success) {
      els.push(<a href={`/profile/${mention.did}`}>{segment.text}</a>)
    } else if ((link != null) && AppBskyRichtextFacet.validateLink(link).success) {
      els.push(<a href={link.uri}>{segment.text}</a>)
    } else if ((tag != null) && AppBskyRichtextFacet.validateTag(tag).success) {
      els.push(<a href={tag.tag}>{segment.text}</a>)
    } else {
      els.push(segment.text);
    }
  }

  return (<div style={{ whiteSpace: 'pre-wrap' }}>{els}</div>)
}

export default RichText;
