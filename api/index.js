import {getAdvertiseCarouselType} from "./advertiseRequest.js";
import {getAllProductType, getProductByType, getProductByID, getProductByIDs} from "./product.js";
import {postCheckUser} from "./User.js";

export const apiGetAdvertiseCarouselType = getAdvertiseCarouselType;
export const apiGetAllProductType = getAllProductType;
export const apiGetProductByType = getProductByType;
export const apiGetProductByID = getProductByID;
export const apiGetProductByIDs = getProductByIDs;
export const apiPostCheckUser = postCheckUser;