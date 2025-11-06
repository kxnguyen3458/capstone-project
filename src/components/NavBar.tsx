import useAuth from '@/hooks/useAuth'
import { Button } from './ui/button'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {

    const { currentUser, logout } = useAuth();


    return (
        <nav className='grid grid-cols-[85%_15%] items-center p-5 bg-slate-200 '>
            <div className='grid grid-cols-[70%_30%]'>
                <p className="font-bold text-2xl text-purple-600">Home Service Provider</p>
                <ul className='grid grid-cols-3 text-center items-center '>
                    <li >
                        <NavLink className={({ isActive }) =>
                            `font-bold hover:text-purple-700 ${isActive ? "text-purple-700" : "text-black"
                            }`
                        } to="/">Home</NavLink></li>
                    <li >
                        <NavLink className={({ isActive }) =>
                            `font-bold hover:text-purple-700 ${isActive ? "text-purple-700" : "text-black"
                            }`
                        } to="/profile">
                            Profile
                        </NavLink></li>
                    <li >
                        <NavLink className={({ isActive }) =>
                            `font-bold hover:text-purple-700 ${isActive ? "text-purple-700" : "text-black"
                            }`
                        } to="/cart">Cart</NavLink></li>


                </ul>
            </div>
            <div>
                <ul className='flex space-x-0.5 text-center items-center' >

                    {!currentUser && (
                        <>
                            <Link to="/login">
                                <Button
                                    variant={"outline"}
                                    className='bg-slate-300 font-bold text-black hover:bg-slate-200'
                                >
                                    Log in
                                </Button>
                            </Link>

                            <Link to="/register">
                                <Button className='hover:bg-gray-700'>
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}

                    {currentUser && (
                        <>
                            <span className="font-bold text-blue-700 mr-3">
                                Welcome!
                            </span>
                            <Button onClick={logout} className='bg-red-600 hover:bg-red-700 ml-auto'>
                                Logout
                            </Button>

                        </>

                    )}

                </ul>
            </div>


        </nav>
    )
}

export default NavBar