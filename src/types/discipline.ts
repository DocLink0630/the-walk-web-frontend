import { StaticImageData } from "next/image";

export interface Discipline {
    number: string;
    title: string;
    tagline: string;
    description: string;
    link: string;
    label: string;
    image: string | StaticImageData;
    imagePosition: string;
    size: 'small' | 'large';
  }