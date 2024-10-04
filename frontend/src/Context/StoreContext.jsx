import { createContext, useState ,useEffect } from "react";
import axios from "axios"
export const ThemeContext = createContext();
export const StoreContext = createContext(null);
import {toast} from "react-toastify";
import {assets} from "../assets/assets"

const StoreContextProvider = (props) => {
    const [food_list,setFoodList] = useState([])  //state to manage the foodlist from backend
    const [token,setToken] = useState("");   //state to manage the token
    const [cartItems, setCartItems] = useState({}); //state to manage the cartItems
    const [searchQuery, setSearchQuery] = useState("");   //state to manage the searchquery that is used in the navbar search
    const [orders, setOrders] = useState([]);   //state to manage the orders notification
   
    
    const url = "http://localhost:4000"   //bsckend url
    

//function to fetch the user orders from the backend 
    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });  //getting the response from the api call
            
            setOrders(response.data.data); // Update orders to trigger notifications
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    

    //function to add items into the cart
    const addToCart = async (itemId) => {  //providing the itemId as a parameter
        if (!cartItems[itemId]) {    //if cartitem value is empty or null
            setCartItems((prev) => ({ ...prev, [itemId]: 1 })); //changes the cartItems value to the 1
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 })); //increments the value by 1
        }
        if(token){   //if token is available

            try {
                await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})  //send the api call to backend to add the item into the database by providing the itemId
                
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
           
        }
    };


    //function to remove the food_items from the cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 })); // cartItem is decremented by the 1 item for one particular itemId
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}}) //sending the response to the backend to store in the database by  using the particular itemId
        }
    };

    //function to calculate the total amount of the cart
    const getTotalCartAmount = () => {
        let totalAmount = 0; //asign the default value is 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item); //we are find the item 

                if (itemInfo && itemInfo.price) {
                    totalAmount += itemInfo.price * cartItems[item];  // Multiply the product's price by the quantity in the cart and add to total amount
                }
                
            }
        }
        return totalAmount;  //returns the final amount
    };

    //function to fetch the food item list from the backend/database
    const fetchFoodList = async () =>{
        const response = await axios.get(url+"/api/food/list");   //getting the response from this api call 
        setFoodList(response.data.data)     //setting the food list which recieved from the backend
    }

    //function to load cartdata,when user add the items into the cart the data stored in the database,when user logged in after logged out the data would be restored,
    const loadCartData = async (token) =>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}}); //getting the response fron the backend to get the data that is stored in the database
        setCartItems(response.data.cartData); //setting the cartItems
    }


      // Handle new delivered orders and play notifications
      const handleDeliveredNotifications = (orders) => {
        const deliveredOrders = orders.filter(  //filtering the orders that staus is delivered and that are not notified
            (order) => order.status === "Delivered"   && !order.notified
        );

        deliveredOrders.forEach(async (order) => {  //traversing through the each orders that staus is delivered and that are not notified
            playDeliveryNotificationSound();
            toast.success(`Order #${order._id} has been delivered!`);
           
            try {
                await axios.post(`${url}/api/order/notify`,{orderId:order._id},{headers:{token}}); //sending the data to update the order 
                 // Optionally update local orders state to reflect the notified status
            setOrders(prevOrders => //this is optional,any pre delivery orders that are previously not notified,will change to notified true
                prevOrders.map(o => o._id === order._id ? { ...o, notified: true } : o)
            );
            } catch (error) {
                console.error("Error updating notification status:", error);
            }
            
             
        });
    };

    // Play notification sound
    const playDeliveryNotificationSound = () => {
        const audio = new Audio(assets.deliveryNotification);  //notification
        audio.loop = false;
        audio.volume = 1.0;
        audio.play().catch((error) => {
            console.error("Error playing the notification sound:", error);
        });
    };

    // Set an interval to periodically check for order updates
    useEffect(() => {
        if (token) {
            fetchOrders();
            const intervalId = setInterval(fetchOrders, 30000); // Check every 30 seconds
            return () => clearInterval(intervalId);
        }
    }, [token]);

    // Check for order updates and notify if there are new deliveries
    useEffect(() => {
        handleDeliveredNotifications(orders);
    }, [orders]);




   useEffect(()=>{
    async function loadData(){
        await fetchFoodList();
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"))
            await loadCartData(localStorage.getItem("token"));
            
     }
    }
    loadData();
   },[token])










    const contextValue = {
        food_list, cartItems, setCartItems, addToCart, removeFromCart, getTotalCartAmount, searchQuery, setSearchQuery,url ,token,setToken,loadCartData
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
