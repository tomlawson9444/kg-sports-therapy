export interface Service {
  slug: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export const services: Service[] = [
  {
    slug: "sports-massage",
    name: "Sports Massage",
    description:
      "Deep tissue work to ease muscle tension, speed up recovery, and keep you moving between training sessions.",
    price: "£45",
    duration: "60 minutes",
  },
  {
    slug: "injury-assessment",
    name: "Injury Assessment",
    description:
      "A thorough assessment to identify the cause of pain or injury and build a plan to get you back to full fitness.",
    price: "£40",
    duration: "45 minutes",
  },
  {
    slug: "rehabilitation-programme",
    name: "Rehabilitation Programme",
    description:
      "A structured, hands-on programme of exercises and treatment to rebuild strength and mobility after injury.",
    price: "£50",
    duration: "60 minutes",
  },
];
