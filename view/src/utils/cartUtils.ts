import { useToast } from "@chakra-ui/react";
import { useCart } from "../context/CartContext";

export const useAddToCart = () => {
  const { dispatch } = useCart();
  const toast = useToast();

  const handleAddToCart = (product: any) => {
    dispatch({ type: "ADD_TO_CART", payload: product });

    // GTM Data Layer push for GA4 ecommerce tracking
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      product_name: product.title,
      product_price: product.discount_price,
    });

    // Toast feedback
    toast({
      title: "Added to Cart",
      description: `${product.title} added to your cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return { handleAddToCart };
};

