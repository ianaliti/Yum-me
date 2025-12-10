import type { EventGroup } from '../../app/types/event';

export const mockEvents: EventGroup[] = [
  {
    id: '1',
    title: 'Secret santa Mydigitalschool',
    description: 'Un moment gourmand entre Memli, Jordan, Younes, Jeremy, Nail, Marilou et le reste de l\'équipe.',
    code: 'F6555',
    color: 'red',
    participants: [
      {
        id: '1',
        name: 'Younes',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      {
        id: '2',
        name: 'Jeremy',
        avatar: 'https://i.pravatar.cc/150?img=13',
      },
      {
        id: '3',
        name: 'Marilou',
        avatar: 'https://i.pravatar.cc/150?img=47',
      },
      {
        id: '7',
        name: 'Thomas',
        avatar: 'https://i.pravatar.cc/150?img=14',
      },
      {
        id: '8',
        name: 'Julie',
        avatar: 'https://i.pravatar.cc/150?img=49',
      },
      {
        id: '9',
        name: 'Lucas',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
    ],
    createdAt: '2025-01-10T10:00:00Z',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Secret santa Mydigitalschool',
    description: 'Un moment gourmand entre Memli, Jordan, Younes, Jeremy, Nail, Marilou et le reste de l\'équipe.',
    code: 'F6555',
    color: 'blue',
    participants: [
      {
        id: '1',
        name: 'Younes',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      {
        id: '2',
        name: 'Jeremy',
        avatar: 'https://i.pravatar.cc/150?img=13',
      },
      {
        id: '3',
        name: 'Marilou',
        avatar: 'https://i.pravatar.cc/150?img=47',
      },
      {
        id: '4',
        name: 'Jessica',
        avatar: 'https://i.pravatar.cc/150?img=48',
      },
    ],
    createdAt: '2025-01-08T14:30:00Z',
    createdBy: '2',
  },
  {
    id: '3',
    title: 'Anniversaire Sophie',
    description: 'Célébrons l\'anniversaire de Sophie avec un super resto entre amis !',
    code: 'A2849',
    color: 'purple',
    participants: [
      {
        id: '10',
        name: 'Sophie',
        avatar: 'https://i.pravatar.cc/150?img=43',
      },
      {
        id: '1',
        name: 'Younes',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      {
        id: '5',
        name: 'Sandra',
        avatar: 'https://i.pravatar.cc/150?img=44',
      },
      {
        id: '6',
        name: 'Emma',
        avatar: 'https://i.pravatar.cc/150?img=45',
      },
      {
        id: '8',
        name: 'Julie',
        avatar: 'https://i.pravatar.cc/150?img=49',
      },
    ],
    createdAt: '2025-01-05T18:00:00Z',
    createdBy: '10',
  },
  {
    id: '4',
    title: 'Team Building Dev',
    description: 'Sortie restaurant pour l\'équipe de développement. Au menu : pizza et bonne humeur !',
    code: 'D7123',
    color: 'green',
    participants: [
      {
        id: '2',
        name: 'Jeremy',
        avatar: 'https://i.pravatar.cc/150?img=13',
      },
      {
        id: '7',
        name: 'Thomas',
        avatar: 'https://i.pravatar.cc/150?img=14',
      },
      {
        id: '9',
        name: 'Lucas',
        avatar: 'https://i.pravatar.cc/150?img=15',
      },
      {
        id: '11',
        name: 'Nathan',
        avatar: 'https://i.pravatar.cc/150?img=16',
      },
      {
        id: '13',
        name: 'Hugo',
        avatar: 'https://i.pravatar.cc/150?img=17',
      },
      {
        id: '15',
        name: 'Antoine',
        avatar: 'https://i.pravatar.cc/150?img=18',
      },
    ],
    createdAt: '2025-01-03T12:00:00Z',
    createdBy: '2',
  },
  {
    id: '5',
    title: 'Brunch du dimanche',
    description: 'Retrouvons-nous pour un brunch entre copines ce dimanche !',
    code: 'B4567',
    color: 'orange',
    participants: [
      {
        id: '3',
        name: 'Marilou',
        avatar: 'https://i.pravatar.cc/150?img=47',
      },
      {
        id: '4',
        name: 'Jessica',
        avatar: 'https://i.pravatar.cc/150?img=48',
      },
      {
        id: '8',
        name: 'Julie',
        avatar: 'https://i.pravatar.cc/150?img=49',
      },
      {
        id: '12',
        name: 'Léa',
        avatar: 'https://i.pravatar.cc/150?img=42',
      },
    ],
    createdAt: '2025-01-01T09:00:00Z',
    createdBy: '3',
  },
];
