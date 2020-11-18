import Link from 'next/link';
import s from './Navbar.module.css';
import Logo from '../Logo';

const Navbar = () => {
  return (
    <div className={s.root}>
      <div className="mx-auto max-w-8xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            <nav className="space-x-4 ml-6 hidden lg:block">
              <Link href="/">
                <a className={s.link}>Home</a>
              </Link>
              <Link href="/pricing">
                <a className={s.link}>Pricing</a>
              </Link>
              <Link href="/about">
                <a className={s.link}>About</a>
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            <Link href="/account">
              <a className={s.link}>Account</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
