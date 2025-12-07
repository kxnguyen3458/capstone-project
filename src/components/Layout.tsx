import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  
  return (
    <div className='h-dvh'>
      <NavBar />
      <main className=' '>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout