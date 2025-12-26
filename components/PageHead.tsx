// components/PageHead.tsx
'use client';

import { useEffect } from 'react';

interface PageHeadProps {
  guestName?: string | null;
}

export default function PageHead({ guestName }: PageHeadProps) {
  useEffect(() => {
    if (!guestName) return;

    // Cập nhật title
    document.title = `Thiệp Cưới Khánh Nam và Lan Nhi | Mời ${guestName}`;
    
    // Cập nhật Open Graph và Twitter meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || 
                   document.querySelector(`meta[property="${name}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      }
    };

    // Cập nhật Open Graph
    updateMetaTag('og:title', `Thiệp Cưới Khánh Nam và Lan Nhi | Mời ${guestName}`);
    updateMetaTag('og:description', `Mời ${guestName} tham dự lễ cưới của chúng tôi.`);
    
    // Cập nhật Twitter
    updateMetaTag('twitter:title', `Thiệp Cưới Khánh Nam và Lan Nhi | Mời ${guestName}`);
    updateMetaTag('twitter:description', `Mời ${guestName} tham dự lễ cưới của chúng tôi.`);
  }, [guestName]);

  return null; // Component này không render gì cả
}