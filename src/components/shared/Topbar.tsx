// import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { signOutAccount } from '@/lib/appwrite/api';
import { Button } from '../ui/button';



function Topbar() {

    const navigate = useNavigate();
    const {user} = useUserContext();

    const handleLogOut = async ()=>{
        const isSuccess = await signOutAccount()
        if(isSuccess){
            navigate(0)
        }
    }

  return (
    <section className='topbar border-b-2 border-light-4'>
        <div className='flex-between py-4 px-5'>
            <Link to={"/"} className='flex gap-3 items-center'>
            <h1 className=' text-xl '>
                VisitVista
            </h1>
            </Link>
            <div className='flex gap-4'>
                <Button variant={"ghost"} onClick={()=>{handleLogOut()}} className='shad-button_ghost'>
                    <img src="/assets/icons/logout.svg" alt="logout" />

                </Button>
                <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                <img src={user.imageUrl|| '/assets/icons/profile-placeholder.svg'} alt="profile" className='h-8 w-8 rounded-full' />
                </Link>

            </div>
            
        </div>
      
    </section>
 
  )
}

export default Topbar
