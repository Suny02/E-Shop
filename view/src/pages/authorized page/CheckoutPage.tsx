import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { email } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    card_no: "",
    card_name: "",
    expiry: "",
    cvv: "",
  });
  const toast = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOrder = () => {
    if (
      formData.name === "" ||
      formData.phone === "" ||
      formData.address === "" ||
      formData.city === "" ||
      formData.zip === ""
    ) {
      toast({
        duration: 5000,
        isClosable: true,
        render: () => (
          <Alert status="error" borderRadius="lg" bg="red" color="white">
            <AlertIcon />
            <AlertTitle mb={0} mr={2} fontSize="md">
              Fill all the details in the form correctly!
            </AlertTitle>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        ),
      });
      return;
    }

    if (paymentMethod === "card") {
      if (
        formData.card_no === "" ||
        formData.card_name === "" ||
        formData.expiry === "" ||
        formData.cvv === ""
      ) {
        toast({
          duration: 5000,
          isClosable: true,
          render: () => (
            <Alert status="error" borderRadius="lg" bg="red" color="white">
              <AlertIcon />
              <AlertTitle mb={0} mr={2} fontSize="md">
                Fill all the card details!
              </AlertTitle>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>
          ),
        });
        return;
      }
    }

    toast({
      duration: 3000,
      isClosable: true,
      render: () => (
        <Alert status="success" borderRadius="lg" bg="green.500" color="white">
          <AlertIcon />
          <AlertTitle mb={0} mr={2} fontSize="md">
            Order placed successfully via{" "}
            {paymentMethod === "cod" ? "Cash on Delivery" : "Card"}!
          </AlertTitle>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      ),
    });
    navigate("/");
  };

  return (
    <Box w="95%" mx="auto" py="12" px={{ base: "6", lg: "8" }}>
      <Box
        display={{ base: "block", lg: "flex" }}
        justifyContent={"center"}
        gap="5%"
      >
        {/* Shipping Info */}
        <Box
          w={{ base: "100%", lg: "40%" }}
          bg="white"
          shadow="lg"
          rounded="lg"
          p="6"
        >
          <Text fontSize="2xl" fontWeight="semibold" mb="4">
            Shipping Information
          </Text>
          <Stack spacing="4">
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" onChange={handleInputChange} />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email Address</FormLabel>
              <Input type="email" value={email} readOnly />
            </FormControl>
            <FormControl id="phone">
              <FormLabel>Phone Number</FormLabel>
              <Input type="number" name="phone" onChange={handleInputChange} />
            </FormControl>
            <FormControl id="address">
              <FormLabel>Address</FormLabel>
              <Input type="text" name="address" onChange={handleInputChange} />
            </FormControl>
            <FormControl id="city">
              <FormLabel>City</FormLabel>
              <Input type="text" name="city" onChange={handleInputChange} />
            </FormControl>
            <FormControl id="zip">
              <FormLabel>ZIP Code</FormLabel>
              <Input type="number" name="zip" onChange={handleInputChange} />
            </FormControl>
          </Stack>
        </Box>

        {/* Payment Info */}
        <Box
          w={{ base: "100%", lg: "40%" }}
          bg="white"
          shadow="lg"
          rounded="lg"
          p="6"
          mt={{ base: "8", lg: "0" }}
        >
          <Text fontSize="2xl" fontWeight="semibold" mb="4">
            Payment Information
          </Text>
          <Stack spacing="4">
            <FormControl id="paymentMethod">
              <FormLabel>Select Payment Method</FormLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit / Debit Card</option>
              </Select>
            </FormControl>

            {paymentMethod === "card" && (
              <>
                <FormControl id="cardNumber">
                  <FormLabel>Card Number</FormLabel>
                  <Input
                    type="number"
                    name="card_no"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl id="cardName">
                  <FormLabel>Cardholder Name</FormLabel>
                  <Input
                    type="text"
                    name="card_name"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl id="expiry">
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    type="number"
                    name="expiry"
                    onChange={handleInputChange}
                    placeholder="MM / YY"
                  />
                </FormControl>
                <FormControl id="cvv">
                  <FormLabel>CVV</FormLabel>
                  <Input
                    type="text"
                    name="cvv"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </>
            )}
          </Stack>
        </Box>
      </Box>

      <Box mt="8">
        <Button colorScheme="blue" size="lg" width="85%" onClick={handleOrder}>
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
