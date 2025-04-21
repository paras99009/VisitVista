

import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import Topbar from '@/components/shared/Topbar'

import { Outlet } from 'react-router-dom'


const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex flex-1">
        {/* Sidebar remains fixed */}
        <LeftSideBar />

        {/* Main content scrolls */}
        <section className="flex-1 overflow-auto">
          <Outlet />
        </section>
      </div>

      <BottomBar />
    </div>
  );
};



  

export default RootLayout
