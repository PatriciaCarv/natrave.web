 export const Input = ( { name, label, error, ...props}) => (
    <div className="flex flex-col">
         <label htmlFor={name} className="text-sm font-bold text-grey-500 mb-2">{label}</label>
        <input {...props} name= {name} id={name} className={`p-3 border border-grey-700 rounded-xl focus:outline-1 focus:outline-grey-700" ${error && 'border-red-300'}`} />
        <span className="p-2 text-sn text-red-300">{error}</span>
    </div>
)