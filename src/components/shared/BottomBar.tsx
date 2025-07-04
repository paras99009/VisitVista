import { bottombarLinks } from '@/constants';
import {Link , useLocation} from 'react-router-dom';


function BottomBar() {
  const {pathname} = useLocation();
  return (
    <section className="bottom-bar fixed bottom-0 w-full z-50 ">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className= "invert-white"
            />

            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
}

export default BottomBar
