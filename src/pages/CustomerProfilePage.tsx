// import { Button } from "@/components/ui/button"
import people from "@/assets/people.jpg"
import { Mail, MapPin, Phone } from "lucide-react"
// import { DialogTrigger } from "@radix-ui/react-dialog"
import CustomerProfile from "@/components/profile/CustomerProfile"

const CustomerProfilePage = () => {
  return (
    <main className='w-screen flex justify-center items-center h-full  '>
      <div className="mx-10 p-10
            border border-white/20  shadow-lg backdrop-blur-md
            w-screen min-h-full max-w-full bg-white flex flex-col gap-10">
        <section className="flex justify-between items-center">
          <div className="flex items-center ">
            <img src={people}
              className="rounded-full w-[100px] h-[100px] object-cover object-center"></img>
            <div className="ml-4">
              <h2 className="font-bold text-xl">Jane Doe</h2>
              <p className="text-sm">Confirmed customer</p>
            </div>

          </div>
          <CustomerProfile/>

        </section>

        <section className="w-1/2 flex flex-col gap-y-3">
          <h2 className="font-bold text-2xl h-full">Personal Information</h2>

          <div className="flex">
            <Mail />
            <p className="ml-5">test@example.com</p>
          </div>

          <div className="flex">
            <Phone />
            <p className="ml-5">123-456-5587</p>
          </div>

          <div className="flex">
            <MapPin />
            <p className="ml-5">123 Main St, Little Rock, Ar, 72205</p>
          </div>


        </section>



      </div>
    </main>
  )
}

export default CustomerProfilePage