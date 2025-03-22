import { Separator } from '@/components/ui/separator';
import { links } from '@/utils/types';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className='fixed bottom-0 bg-secondary flex w-full justify-between flex-col items-center'>
      <Separator className='bg-primary p-0.5 rounded-2xl ' />
      <div className='flex w-full justify-between p-4'>
        {links.map((link) => {
          const { href, label, icon: Icon } = link;
          return (
            <Link href={href} key={label} className='flex items-center flex-col'>
              <Icon />
              <span className='text-primary capitalize'>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
