import { createContext, useState ,useEffect } from "react";
import axios from "axios"
export const ThemeContext = createContext();
export const StoreContext = createContext(null);
import {toast} from "react-toastify";
import {assets} from "../assets/assets"

const StoreContextProvider = (props) => {
    const [food_list,setFoodList] = useState([])
    const [token,setToken] = useState("");
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    
    const url = "http://192.168.198.22:4000"
    


    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            
            setOrders(response.data.data); // Update orders to trigger notifications
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if(token){

            try {
                await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
                
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
           
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };
    const fetchFoodList = async () =>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }
    const loadCartData = async (token) =>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }


      // Handle new delivered orders and play notifications
      const handleDeliveredNotifications = (orders) => {
        const deliveredOrders = orders.filter(
            (order) => order.status === "Delivered"   && !order.notified
        );

        deliveredOrders.forEach(async (order) => {
            playDeliveryNotificationSound();
            toast.success(`Order #${order._id} has been delivered!`);
           
            try {
                await axios.post(`${url}/api/order/notify`,{orderId:order._id},{headers:{token}});
                 // Optionally update local orders state to reflect the notified status
            setOrders(prevOrders =>
                prevOrders.map(o => o._id === order._id ? { ...o, notified: true } : o)
            );
            } catch (error) {
                console.error("Error updating notification status:", error);
            }
            
             
        });
    };

    // Play notification sound
    const playDeliveryNotificationSound = () => {
        const audio = new Audio(assets.deliveryNotification);
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
