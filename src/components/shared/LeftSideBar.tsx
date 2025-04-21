import { useUserContext } from '@/context/AuthContext';

import { Link, NavLink, useNavigate,useLocation } from 'react-router-dom'


import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { signOutAccount } from '@/lib/appwrite/api';
import { Button } from '../ui/button';

function LeftSideBar() {
 
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {user} = useUserContext();




  const handleLogOut = async ()=>{
      const isSuccess = await signOutAccount()
      if(isSuccess){
          navigate(0)
      }
  }
  return (
    <nav className='leftsidebar border-r border-light-4 h-screen sticky top-0 rounded-tr-3xl rounded-br-3xl bg-white shadow-md'>

        <div className='flex flex-col gap-11'>
         <Link to={"/"} className='flex gap-3 items-center'>
            <h1 className=' text-3xl'> VisitVista</h1>
        </Link>

        
        <Link to={`/profile/${user.id}`} className='flex items-center gap-3'>
          <img src={user.imageUrl|| '/assets/images/profile-placeholder.svg'} alt="profile" className='h-8 w-8 rounded-full' />
            <div className='flex flex-col '>
                <p className='body-bold'>{user.name}</p>    
                <p className='small-regular text-light-3'>@{user.username}</p>
            </div>
         </Link>

        <ul className='flex flex-col  gap-6'>
         {
          sidebarLinks.map((link:INavLink)=>{

            const isActive = pathname === link.route;
            return (
              <li key={link.label} style={{borderRadius:"20px"}} className={`leftsidebar-link group  ${isActive&& 'bg-primary-500'}`} >

              <NavLink to={link.route} className="flex gap-4  items-center p-4" >
                <img src={link.imgURL} alt={link.label} className={` h-8 w-8 custom-color invert-white ${isActive && 'invert-white'}`}/>
                {link.label}

              </NavLink>
              </li>
            )

          })
         }



        </ul> 

        </div>
          <Button variant={"ghost"} onClick={()=>{handleLogOut()}} className='shad-button_ghost'>
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className='small-medium lg:base-medium '>Logout</p>
      
          </Button>
     
    </nav>
  )
}

export default LeftSideBar
