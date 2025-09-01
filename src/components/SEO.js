import React, { useEffect } from 'react';

const ensureMeta = (selectorAttr, name, content) => {
  if (!content) return;
  let el = document.querySelector(`${selectorAttr}="${name}"`);
  if (!el) {
    // determine if selectorAttr is rel/link or meta property/name
    if (selectorAttr === 'link[rel') {
      el = document.createElement('link');
      el.setAttribute('rel', name);
      document.head.appendChild(el);
    } else {
      el = document.createElement('meta');
      const attr = selectorAttr === 'property' ? 'property' : 'name';
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
  }
  if (el.tagName === 'LINK') el.setAttribute('href', content); else el.setAttribute('content', content);
};

const SEO = ({ title, description, url, image, children }) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.setAttribute('name', 'description'); document.head.appendChild(metaDesc); }
      metaDesc.setAttribute('content', description);
    }

    // Open Graph
    const setProperty = (prop, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', value);
    };

    setProperty('og:title', title);
    setProperty('og:description', description);
    setProperty('og:type', 'website');
    setProperty('og:site_name', 'Presto Guitar Academy');
    setProperty('og:image', image);
    setProperty('og:url', url);

    // Twitter cards
    const setName = (name, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', value);
    };

    setName('twitter:card', 'summary_large_image');
    setName('twitter:title', title);
    setName('twitter:description', description);
    setName('twitter:image', image);

    // canonical
    if (url) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); }
      link.setAttribute('href', url);
    }
  }, [title, description, url, image]);

  return children ? <>{children}</> : null;
};

export default SEO;
