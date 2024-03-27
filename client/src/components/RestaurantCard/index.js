import { IMAGE_URL } from "../../config";
import "./index.css";

const RestaurantCard = ({ cloudinaryImageId, name, cuisines, avgRating }) => {
  return (
    <div className='Restaurant'>
      <div className='imageDiv'>
        <img src={IMAGE_URL + cloudinaryImageId} alt={name + "_image"} />
      </div>
      <div className='contentDiv'>
        <h2>{name}</h2>
        <h3>
          {cuisines?.length > 4
            ? cuisines?.slice(0, 4).join(", ")
            : cuisines?.join(", ")}
        </h3>
        <h4>{avgRating} stars</h4>
      </div>
    </div>
  );
};

export default RestaurantCard;
