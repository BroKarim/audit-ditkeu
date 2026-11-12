import { NavGroup } from '@/types';

/**
 * Navigation configuration
 *
 * This configuration is used for both the sidebar navigation and the Cmd+K bar.
 *
 * Access control:
 * An item can carry an `access` property with the minimum application role
 * required to see it (`user` < `admin`). This only hides items in
 * the UI — every mutation must still be authorized server-side.
 *
 * Example:
 *    access: { role: 'admin' }
 */
export const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      {
        title: 'BPK',
        url: '/dashboard/overview',
        icon: 'bpk',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'KAP',
        url: '/dashboard/kap',
        icon: 'kap',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'BPKP',
        url: '/dashboard/bpkp',
        disabled: true,
        icon: 'bpkp',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        title: 'ITJEN',
        url: '/dashboard/itjen',
        disabled: true,
        icon: 'itjen',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  },
  {
    label: 'Setting',
    items: [
      {
        title: 'Akses & Peran',
        url: '/dashboard/access',
        icon: 'teams',
        shortcut: ['a', 'a'],
        isActive: false,
        items: [],
        // Admin-only: the sidebar hides it for other roles (UX), and the
        // page + server actions enforce the same rule server-side.
        access: { role: 'admin' }
      },
      {
        title: 'Account',
        url: '#',
        icon: 'account',
        isActive: true,
        items: [
          {
            title: 'Profile',
            url: '/dashboard/profile',
            icon: 'profile',
            shortcut: ['m', 'm']
          }
        ]
      }
    ]
  }
];
