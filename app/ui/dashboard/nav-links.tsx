'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'; //새로고침 없이 children만 렌더링 해올 수 있게 해줌
import { usePathname } from 'next/navigation'; //usePathname은 훅이라서 파일 맨위에 'use client' 명시 해줘야함
// usePathname : 사용자의 현재 경로
import clsx from 'clsx'; //사용 clsx({"class-name": booleanValue})

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname(); //현재 url을 얻어와서 nav에서 눌러진 경로와 같다면 파란색 텍스트, 하늘색 배경으료 표시
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={ clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { 'bg-sky-100 text-blue-600' : pathname === link.href, }, // pathname === link.href가 true일때 왼쪽 값이 classname으로 들어감.
              )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        ); 
      })}
    </>
  );
}
