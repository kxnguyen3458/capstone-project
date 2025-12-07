export function formatDuration(duration:number | null){
    if(duration== null )return;
    if(duration < 0 ) return;
    if(duration <= 59){
        return `${duration}m`;
    }else{
        const hr = Math.floor(duration/60);
        const mn = duration%60;
        return `${hr}h ${mn}m`;
    }
};

export function formatNumberWithDecimal(num:number | string): string {
    if(!num) return "";
  const [int, decimal] = num.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}


export function formatUUID(uuid:string): string {
    if(!uuid || uuid.length !== 32) {
        throw new Error("Invalid compact UUID");
    }

   return (
    uuid.slice(0, 8) + "-" +
    uuid.slice(8, 12) + "-" +
    uuid.slice(12, 16) + "-" +
    uuid.slice(16, 20) + "-" +
    uuid.slice(20)
  );
}


