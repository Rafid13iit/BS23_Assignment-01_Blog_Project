export const Error404NotFound = () => {
    return <div className="flex flex-col items-center justify-center text-center text-red-500 h-screen">Error 404 Not Found!</div>;
  };const NotFoundPage = () => {
    return (
      <div className="padding-x py-9 max-container flex flex-col items-center justify-center gap-4 bg-[#F6F6F7] dark:bg-[#242535] h-screen">
      
  
      <h2 className="text-[#3B3C4A] text-4xl max-md:leading-[2rem] lg:leading-normal lg:mx-[200px] text-center dark:text-[#BABABF]">
        404 Page Not Found.
      </h2>
  
     
    </div>
    )
  }
  
  export default NotFoundPage