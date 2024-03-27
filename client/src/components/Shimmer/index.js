import "./index.css";

const Shimmer = () => {
  return (
    <>
      <div className='shimmer-search'></div>
      <div className='Restaurants'>
        {Array(20)
          .fill("")
          .map((value, index) => {
            return (
              <div className='shimmer-card' key={index}>
                <div className='shimmer-image' key='image'></div>
                <div className='shimmer-headline' key='headline'></div>
                <div className='shimmer-text' key='text1'></div>
                <div className='shimmer-text' key='text2'></div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Shimmer;
