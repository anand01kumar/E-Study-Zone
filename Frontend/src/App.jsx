import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { lazy,Suspense } from 'react'
import Skills from './pages/trainer/Skills'
import UploadContent from './pages/trainer/UploadContent'
import Handshake from './pages/trainer/Handshake'
import ChangePassword from './pages/trainer/ChangePassword'
import Profile from './pages/trainer/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import HandshakeRequest from './pages/user/HandshakeRequest'
import Mycontent from './pages/user/Mycontent'
import DasbordTrainer from './pages/trainer/DasbordTrainer'
import UserManagement from './pages/admin/UserManagement'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import ContentManagement from './pages/admin/ContentManagement'
import ChangePasswords from './pages/admin/ChangePasswords'


const  AdminRegister =lazy(()=>import('./pages/admin/AdminRegister'))
const  AdminLogin =lazy(()=>import('./pages/admin/AdminLogin'))
const Register=lazy(()=>import ('./pages/public/Register'))
const Login =lazy(()=>import('./pages/public/Login'))
const TrainerDasbord=lazy(()=>import ('./pages/trainer/TrainerDasbord'));
const UserDasbord=lazy(()=>import('./pages/user/UserDasbord'))
const App = () => {
  return (
    <>
    <BrowserRouter >
    <Suspense fallback={<div>...Loading</div>}>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/admin-login" element={<AdminLogin/>}></Route>
      <Route path="/admin-register" element={<AdminRegister/>}></Route>
      <Route path="/TrainerDasbord" element={<TrainerDasbord/>}>
      <Route index element={<DasbordTrainer/>}></Route>
      <Route path='Skills' element={<Skills/>}></Route>
      <Route path='Profile' element={<Profile/>}></Route>
      <Route path='UploadContent' element={<UploadContent/>}></Route>
      <Route path='Handshake' element={<Handshake/>}></Route>
      <Route path='ChangePassword' element={<ChangePassword/>}></Route>
      </Route>
      <Route path="/LearnerDasbord" element={<UserDasbord/>}>
      <Route path='Skills' element={<Skills/>}></Route>
      <Route path='Profile' element={<Profile/>}></Route>
      <Route path='UploadContent' element={<UploadContent/>}></Route>
      <Route path='HandshakeRequest' element={<HandshakeRequest/>}></Route>
      <Route path='ChangePassword' element={<ChangePassword/>}></Route>
      <Route path='mycontent' element={<Mycontent/>}></Route>
      </Route>
     <Route path="/admindashboard" element={<AdminDashboard/>}>
  <Route index element={<DashboardAdmin/>}></Route>
  <Route path="usermanagement" element={<UserManagement/>}></Route>
  <Route path="contentmanagement" element={<ContentManagement/>}></Route>
  <Route path="changepasswords" element={<ChangePasswords/>}></Route>
</Route>

    </Routes>
    </Suspense>
    </BrowserRouter>
    </>
  )
}

export default App