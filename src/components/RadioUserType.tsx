import { Label } from "@/components/ui/label"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { FormControl, FormItem } from './ui/form'

const RadioUserType = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    return (
        <RadioGroup value={value} onValueChange={onChange}
            className=' grid grid-cols-2 gap-4 mb-5' >
            <div className='p-5 bg-slate-200'>
                <FormItem className="flex  items-center gap-3">
                    <FormControl >
                        <RadioGroupItem value="customer" id="customer" className='border-slate-400 bg-slate-100'/></FormControl>
                    <Label htmlFor="customer">Customer</Label>
                </FormItem>
            </div>
            <div className='p-5 bg-slate-200'>
                <FormItem className="flex items-center gap-3">
                    <FormControl>
                        <RadioGroupItem value="vendor" id="vendor" className='border-slate-400 bg-slate-100'/></FormControl>
                    <Label htmlFor="vendor">Vendor</Label>
                </FormItem>
            </div>
        </RadioGroup>
    )
}

export default RadioUserType