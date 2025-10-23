
const CustomToast = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-white/30 backdrop-blur-sm'>
      <div className="flex justify-center items-center bg-slate-100 text-black rounded-xl shadow-lg  w-[300px] h-[300px]">
        <div className='flex flex-col justify-center items-center gap-4 '>
          <p className=" font-bold text-xl ">Sign up success!</p>
          <h2 className='font-bold text-lg text-purple-700'>Please Log in</h2>
        </div>
      </div>
    </div>
  )
}

export default CustomToast