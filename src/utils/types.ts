import { LucideIcon } from 'lucide-react';
import { Home, Dumbbell, SquareUserRound, Utensils } from 'lucide-react';
type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const links: NavLink[] = [
  { href: '/', label: 'home', icon: Home },
  { href: '/workout', label: 'workout', icon: Dumbbell },
  { href: 'diet', label: 'diet', icon: Utensils },
  { href: 'profile', label: 'profile', icon: SquareUserRound },
];
