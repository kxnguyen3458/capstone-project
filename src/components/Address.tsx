
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';




const Address = ({ prefix = "address" }: { prefix: string }) => {
    const { control } = useFormContext();
    const addFieldName = (key: string) => `${prefix}.${key}` as const

    return (
        <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-4'>
                <FormField control={control}
                    name={addFieldName("houseNumber")}
                    render={({ field }) => (
                        <FormItem >
                            <FormControl>
                                <Input placeholder="House number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField control={control} name={addFieldName("street")} render={({ field }) => (
                    <FormItem className='col-span-2'>
                        <FormControl>
                            <Input placeholder="Street" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

            </div>

            <div>
                <FormField control={control} name={addFieldName("city")} render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name={addFieldName("zipcode")} render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Zipcode" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name={addFieldName("zipcode")} render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Zipcode" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>



        </div>
    )
}

export default Address