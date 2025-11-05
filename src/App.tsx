
import { Route, Routes } from 'react-router-dom'

import './globals.css'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import SignInForm from './_auth/forms/SignInForm'
import Home from './_root/pages/Home'
import RootLayout from './_root/RootLayout'
import CreatePlace from './_root/pages/CreatePlace'
import Saved from './_root/pages/Saved'
import Explore from './_root/pages/Explore'
import PlaceDetails from './_root/pages/Placedetail'
import AiChat from './_root/pages/AiChat'
import Admin from './_root/pages/Admin'
import { ToastContainer } from 'react-toastify'
import RequestPage from './_root/pages/RequestPage'

function App() {


  return (
    <>
      {/* Add ToastContainer here to display notifications */}
      <ToastContainer />  



    <Routes>

      {/* auth Routes */}
    <Route element={<AuthLayout/>}>
      <Route path="/sign-in" element={<SignInForm/>} />
      <Route path="/sign-up" element={<SignupForm/>} />
      </Route>

      {/* Main Routes */}
      <Route element={<RootLayout/>}>
      <Route path="/" element={<Home/>} />
      <Route path="/dashboard/admin" element={<Admin/>} />
      <Route path="/create" element={<CreatePlace/>} />
      <Route path="/saved" element={<Saved/>} />
      <Route path="/explore" element={<Explore/>} />
      <Route path="/explore/:mood" element={<Explore/>} />
      <Route path="/ai-chat" element={<AiChat/>} />
      <Route path="/places/:id" element={<PlaceDetails/>} />
      <Route path="/placerequest" element={<RequestPage/>} />
    
      </Route>
    </Routes>


    </>
  )
}

export default App
