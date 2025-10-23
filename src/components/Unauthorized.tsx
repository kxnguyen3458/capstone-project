import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate();
  return (
    <div>
        <h1>Unauthorized</h1>
        <p>You are not authorized to request this page!</p>
        <br/>
        <Button onClick={()=>navigate(-1)}>Go back</Button>
    </div>
  )
}

export default Unauthorized