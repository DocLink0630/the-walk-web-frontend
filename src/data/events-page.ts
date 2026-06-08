import type { EventsPageContent } from "@/types/events-page";

const fc = (filename: string) =>
  `/images/fashion_couture/${encodeURIComponent(filename)}`;

const FASHION_COUTURE_COVER = "fashion_couture_cover.jpg";

/** Listing page hero only — runway photography */
const UNSPLASH_EVENTS_HERO =
  "https://images.unsplash.com/photo-1635279474047-ab3cda78bbe8?w=1920&q=85";

const FASHION_COUTURE_GALLERY = [
  "707781337_1621781849855430_6400590879678405501_n.jpg",
  "708656308_1621782813188667_2715085176716255969_n.jpg",
  "708993166_1621781983188750_4024783876638047863_n.jpg",
  "709079107_1621782476522034_9175118848390649825_n.jpg",
  "709122102_1624018069631808_2250050489836772678_n.jpg",
  "709155957_1624017909631824_8731089788020862637_n.jpg",
  "709205740_1621781939855421_6970103989145661069_n.jpg",
  "709206093_1621782539855361_9036492214474234795_n.jpg",
  "709246301_1621782089855406_3070747003379067482_n.jpg",
  "709266544_1621782759855339_562698074698709403_n.jpg",
  "709307086_1624027336297548_2877349450884458692_n.jpg",
  "709346749_1624017572965191_8148733974550907579_n.jpg",
  "709368140_1624017792965169_5726124128908216335_n.jpg",
  "709466508_1621782826521999_5345448961699675844_n.jpg",
  "710079013_1624017932965155_2284745175689031147_n.jpg",
  "710079033_1624017396298542_3789950340009234146_n.jpg",
  "710098305_1624018212965127_1432427762141532604_n.jpg",
  "710098305_1624027376297544_1947564821081951303_n.jpg",
  "710098315_1624017402965208_6188002601625451459_n.jpg",
  "710118260_1624019439631671_7437070990354761053_n.jpg",
  "710496924_1624019589631656_3938462684622788734_n.jpg",
  "710516886_1624017766298505_8717711471504621452_n.jpg",
  "710613071_1624027436297538_2656820415511897803_n.jpg",
  "710700536_1624019232965025_2087993081295845315_n.jpg",
  "711425893_1624018032965145_9164310641921509104_n.jpg",
  "711466606_1624017576298524_776445867211543576_n.jpg",
  "711466644_1621781799855435_6326899246385697188_n.jpg",
  "711473780_1624018172965131_2125508439133357507_n.jpg",
  "711532172_1621782056522076_7450988952730264695_n.jpg",
  "711602173_1624019212965027_7043725807389087754_n.jpg",
  "711618364_1621782869855328_3480366398879843313_n.jpg",
  "711643164_1624019516298330_5220556976799654232_n.jpg",
  "711655056_1624018139631801_3015473548382748144_n.jpg",
  "711655608_1624019562964992_4374448150657892032_n.jpg",
  "711670964_1624017856298496_2809388484142018085_n.jpg",
  "711729686_1624018319631783_5293372138060524007_n.jpg",
  "713123453_1621782276522054_2618380569351772262_n.jpg",
].map(fc);

const FASHION_COUTURE_DESCRIPTION =
  "Fashion Couture is a prestigious runway showcase featuring the talented models of THE WALK Model Academy. This event is designed to highlight creativity, confidence, elegance, and professional catwalk skills developed through our training program.";

export const EVENTS_PAGE: EventsPageContent = {
  hero: {
    eyebrow: "THE WALK MODEL ACADEMY",
    heading: "EVENTS",
    subtitle:
      "Runway showcases, graduate presentations, and industry moments from Sri Lanka's leading model academy.",
    backgroundImage: UNSPLASH_EVENTS_HERO,
  },
  cta: {
    eyebrow: "PARTNER WITH US",
    heading: "Bring your brand to our next event.",
    description:
      "We work with brands, designers, and sponsors to create memorable industry moments. Sponsorship packages, casting access, and bespoke event partnerships available.",
    primaryLabel: "Event Partnership Enquiry",
    primaryHref: "/inquiry",
    secondaryLabel: "Register as Talent",
    secondaryHref: "/register",
  },
  events: [
    {
      id: "fashion-couture-2026",
      title: "Fashion Couture 2026",
      date: "April 2026",
      location: "Ape Gama Complex",
      category: "RUNWAY",
      status: "PAST",
      description: FASHION_COUTURE_DESCRIPTION,
      fullDescription: FASHION_COUTURE_DESCRIPTION,
      highlight: "THE WALK Model Academy presents",
      image: fc(FASHION_COUTURE_COVER),
      gallery: FASHION_COUTURE_GALLERY,
    },
  ],
};
