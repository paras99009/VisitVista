import { useUserContext } from '@/context/AuthContext';

import { Link, NavLink, useNavigate,useLocation } from 'react-router-dom'


import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { signOutAccount } from '@/lib/appwrite/api';
import { Button } from '../ui/button';
import { useState } from 'react';

function LeftSideBar() {
 
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  
  const {user} = useUserContext();
  const isAdmin = user.email == "test1@gmail.com"




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

        
        <Link to={`${isAdmin ? '/dashboard/admin' : `/profile/${user.id}`}`}  className='flex items-center gap-3'>
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
        <Button variant={"ghost"} onClick={() => setShowLogoutModal(true)} className='shad-button_ghost'>
  <img src="/assets/icons/logout.svg" alt="logout" />
  <p className='small-medium lg:base-medium'>Logout</p>
</Button>
{showLogoutModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 bg-opacity-40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center text-center space-y-6 animate-fadeIn">
      
      <div className="flex flex-col items-center space-y-2">
        <p className="text-xl font-semibold text-gray-800">Logout Confirmation</p>
        <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
      </div>

      <div className="flex w-full gap-4">
        <Button 
          onClick={handleLogOut} 
          className="w-full bg-red-500 hover:bg-red-600 text-black hover:border-light-3 hover:border-2 font-semibold py-2 rounded-xl transition-all"
        >
          Yes, Logout
        </Button>
        <Button 
          onClick={() => setShowLogoutModal(false)} 
          className="w-full bg-gray-100 hover:bg-gray-200 text-light-4  font-semibold py-2 rounded-xl transition-all"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

     
    </nav>
  )
}

export default LeftSideBar
