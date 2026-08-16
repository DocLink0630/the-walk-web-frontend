import { Discipline } from '@/types/discipline';
import modelAcademy from '@/assets/images/model-academy.webp'
import models from '@/assets/images/models.webp'
import photographers from '@/assets/images/photgrapher.webp'
import beautyArtists from '@/assets/images/beautician.webp'
import influencerPortrait from '@/assets/images/influencer-portrait.jpg'
export const disciplines: Discipline [] = [
    {
        number: '01',
        title: 'DISCOVER TALENT',
        tagline: 'Editorial · Runway · Commercial',
        description:
          'Discover verified models across every category. Browse portfolios, check availability, and send an inquiry directly through the platform.',
        link: '/models',
        label: 'VIEW MODEL ROSTER →',
        image:
          modelAcademy.src,
        imagePosition: 'center top',
        size: 'large',
      },
      {
        number: '02',
        title: 'THE WALK ACADEMY',
        tagline: 'Train · Graduate · Get Listed',
        description:
          'Professional modelling courses taught by industry veterans. Complete the program and launch your profile on the platform.',
        link: '/academy',
        label: 'JOIN TODAY →',
        image:
          models.src,
        imagePosition: 'center top',
        size: 'small',
      },
      {
        number: '03',
        title: 'PHOTOGRAPHERS',
        tagline: 'Fashion · Campaign · Portrait',
        description:
          'Editorial and commercial photographers available for bookings. Review their work, rates, and availability before you inquire.',
        link: '/photographers',
        label: 'FIND A PHOTOGRAPHER →',
        image:
          photographers.src,
        imagePosition: 'center',
        size: 'small',
      },
      {
        number: '04',
        title: 'BEAUTY ARTISTS',
        tagline: 'Makeup · Hair · Styling',
        description:
          'Makeup artists and hair stylists with verified credentials. Find the right artist for your editorial shoot, event, or production.',
        link: '/beauticians',
        label: 'FIND AN ARTIST →',
        image:
          beautyArtists.src,
        imagePosition: 'center',
        size: 'large',
      },
      {
        number: '05',
        title: 'INFLUENCERS',
        tagline: 'Fashion · Beauty · Lifestyle',
        description:
          'Content creators available for brand partnerships and campaigns. Review their channels, reach, and past work before you inquire.',
        link: '/influencers',
        label: 'FIND AN INFLUENCER →',
        image:
          influencerPortrait.src,
        imagePosition: 'center',
        size: 'large',
      },
]