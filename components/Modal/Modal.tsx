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
          <div className="fixed z-20 inset-0 m-auto h-min w-96 bg-white rounded">
            <div className="flex flex-col">
              <div className="flex h-8 border-b-2 justify-between items-center mt-2">
                <div className="font-semibold text-lg ml-4">{title}</div>
                <div
                  className="mr-4 font-bold cursor-pointer "
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
            className="absolute z-index-10 w-screen h-screen inset-0 bg-opacity-50 bg-black cursor-pointer"
            onClick={() => setIsOpen(false)}
          ></div>
        </>
    )
};
