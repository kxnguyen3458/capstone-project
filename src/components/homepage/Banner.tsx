// import { Search } from "lucide-react"
// import { Input } from "../ui/input"

const Banner = () => {
  return (
    <div className="h-1/4 w-full bg-linear-to-r from-indigo-700 to-purple-600
        flex justify-center items-center text-white p-10 text-center">
        <div className="flex flex-col space-y-5">
            <h2>Find the Perfect Service</h2>
            <p>Browse our wide selection of professional services and book the ones you need</p>


              {/* search */}
            {/* <form className="mx-auto flex items-center w-full max-w-3xl rounded-md bg-white px-4 py-2 shadow-md">
                <Search className="w-5 h-5 text-gray-400"/>
                <Input type="text" placeholder="Search for services..."
                className=" ml-3 w-full border-0 bg-transparent! shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-gray-700 placeholder:text-gray-400"
                />
            </form> */}
            
        </div>
    </div>
  )
}

export default Banner