
import { Outlet,Navigate } from 'react-router-dom';
import AuthImage from "../../public/assets/images/authImage1.jpg"



const AuthLayout = () => {
  const isAuthenticated = false
  return (
   <>
   {
    isAuthenticated? (
      <Navigate to={"/"}/>
    ):(
      <>
      <div className='flex flex-col xl:flex-row h-screen w-full'>
      <section className='flex flex-1 justify-center items-center flex-col py-10'>
        <Outlet/>
      </section>

     <img
       src={AuthImage} 
       alt="logo"
       className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"  />

      </div>

     </>
    )
   }

   </>
  )
}

export default AuthLayout
