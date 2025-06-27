import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { signOutAccount } from '@/lib/appwrite/api';
import { Button } from '../ui/button';

function Topbar() {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isAdmin = user?.email === "test1@gmail.com";

  const handleLogOut = async () => {
    const isSuccess = await signOutAccount();
    if (isSuccess) {
      navigate(0);
    }
  };

  return (
    <section className='topbar border-b-2 border-light-4'>
      <div className='flex-between py-4 px-5'>
        <Link to="/" className='flex gap-3 items-center'>
          <h1 className='text-xl'>VisitVista</h1>
        </Link>

        <div className='flex gap-4 items-center'>
          <Button
            variant={"ghost"}
            onClick={() => setShowLogoutModal(true)}
            className='shad-button_ghost'
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link to={isAdmin ? "/dashboard/admin" : `/profile/${user.id}`} className='flex-center gap-3'>
            <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="profile"
              className='h-8 w-8 rounded-full'
            />
          </Link>
        </div>
      </div>

      {/*  Logout Confirmation Modal */}
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-light-4 font-semibold py-2 rounded-xl transition-all"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Topbar;
