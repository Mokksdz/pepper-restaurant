// Section "Avis clients" moderne et animée
// Utilise Tailwind, avatars SVG, étoiles, apparition fade-up

export type Testimonial = {
  name: string;
  text: string;
  rating: number;
  avatarUrl?: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Sarah',
    text: 'Meilleur burger mangé à Alger ! Accueil chaleureux, service rapide, je recommande à 100%.',
    rating: 5,
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Yacine',
    text: 'Le Pepper Smash est incroyable, viande juteuse et pain brioché parfait. Je reviendrai !',
    rating: 5,
    avatarUrl: 'https://randomuser.me/api/portraits/men/34.jpg',
  },
  {
    name: 'Lina',
    text: 'Super ambiance, frites croustillantes, desserts maison délicieux. Top !',
    rating: 4,
    avatarUrl: 'https://randomuser.me/api/portraits/women/43.jpg',
  },
  {
    name: 'Amine',
    text: 'Service rapide, équipe sympa, et les portions sont généreuses. Très bon rapport qualité/prix.',
    rating: 5,
    avatarUrl: 'https://randomuser.me/api/portraits/men/21.jpg',
  },
];

export function TestimonialsSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'max-w-5xl mx-auto mt-16 mb-12 px-2';
  section.setAttribute('data-aos', 'fade-up');
  section.setAttribute('data-aos-delay', '100');

  const title = document.createElement('h2');
  title.className = 'text-2xl md:text-3xl font-extrabold text-center text-black mb-6';
  title.innerHTML = 'Ce que disent nos clients';
  section.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';

  testimonials.forEach(({ name, text, rating, avatarUrl }) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all duration-300';

    const avatar = document.createElement('img');
    avatar.src = avatarUrl || '/assets/images/avatars/default.svg';
    avatar.alt = name;
    avatar.className = 'w-16 h-16 rounded-full shadow mb-3 object-cover bg-gray-100';
    card.appendChild(avatar);

    const stars = document.createElement('div');
    stars.className = 'flex gap-1 mb-2';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('svg');
      star.setAttribute('width', '20');
      star.setAttribute('height', '20');
      star.setAttribute('fill', i < rating ? '#F59E42' : '#E5E7EB');
      star.setAttribute('viewBox', '0 0 20 20');
      star.innerHTML = '<polygon points="10,1 12.59,6.99 19,7.64 14,12.26 15.18,18.54 10,15.5 4.82,18.54 6,12.26 1,7.64 7.41,6.99"/>';
      stars.appendChild(star);
    }
    card.appendChild(stars);

    const quote = document.createElement('p');
    quote.className = 'text-gray-700 mb-2 text-base italic';
    quote.textContent = `"${text}"`;
    card.appendChild(quote);

    const author = document.createElement('span');
    author.className = 'font-semibold text-pepper-orange mt-1';
    author.textContent = name;
    card.appendChild(author);

    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}
