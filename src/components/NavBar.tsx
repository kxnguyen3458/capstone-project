import { Button } from './ui/button'
import { Link, NavLink } from 'react-router-dom'

const NavBar = () => {



    return (
        <nav className='grid grid-cols-[85%_15%] items-center p-5 '>
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
                    <Link to="/login">
                        <Button variant={"outline"} className='bg-slate-300  font-bold text-black hover:bg-slate-200'
                        >Sign in</Button>
                    </Link>
                    <Link to="/register">
                        <Button className='hover:bg-gray-700'>Signup</Button>

                    </Link>

                </ul>
            </div>


        </nav>
    )
}

export default NavBar