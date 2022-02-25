interface Prop{
    isOpen:boolean;
    setIsOpen:Function;
    children?:any;
    title:any;

}

export default function Modal({isOpen,setIsOpen,children,title}:Prop) {

    if(!isOpen) return (<></>)

    return(
        <>
          <div className="fixed z-30 inset-0 m-auto h-min w-96 bg-white rounded">
            <div className="flex flex-col">
              <div className="flex flex-row-reverse h-10 border-b-2 justify-between items-center mt-2 px-6">
                <div className="font-semibold text-lg">{title}</div>
                <div
                  className=" font-bold cursor-pointer "
                  onClick={() => setIsOpen(false)}
                >
                  X
                </div>
              </div>
              <div className=" flex flex-col h-min">
                {/* BODY */}
                {children}
                
              </div>
            </div>
            
          </div>
          <div
            className="fixed z-20 w-screen h-screen inset-0 opacity-60 bg-black cursor-pointer"
            onClick={() => setIsOpen(false)}
          ></div>

          
        </>
    )
};
