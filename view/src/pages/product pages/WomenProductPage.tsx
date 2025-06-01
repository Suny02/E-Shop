import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { WomenProducts } from "../../utils/types";
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";
import { sortByCategory } from "../../config/womenData";
import { DebounceInput } from "react-debounce-input";
import { useCart } from "../../context/CartContext"; // Import your Cart Context

const WomenProductPage = () => {
  const [data, setData] = useState<WomenProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortPrice, setSortPrice] = useState("");
  const [order, setOrder] = useState("discount_price");
  const [limit, setLimit] = useState<string | number>(20);

  const { dispatch } = useCart();  // Use cart context
  const toast = useToast();        // For feedback on add

  const getData = async () => {
    setLoading(true);
    await axios
      .get(
        `https://e-shop-215k.onrender.com/womens?page=${page}&limit=${limit}&category=${category}&sort=${order},${sortPrice}&search=${search}`
      )
      .then((res: AxiosResponse) => {
        setData(res.data.women);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getData();
  }, [page, category, sortPrice, limit, search]);

  // Add to cart handler
  const handleAddToCart = (product: WomenProducts) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast({
      title: "Added to Cart",
      description: `${product.heading} added to your cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <>
      {loading ? (
        <Center m="50px">
          <Image src="/loader.gif" alt="loader" />
        </Center>
      ) : (
        <Box>
          {/* ... Your existing header, filters and pagination code ... */}

          <Flex
            w="98%"
            m="auto"
            gap={{ base: 2, lg: 5 }}
            justifyContent={"center"}
          >
            {/* Filters Box - unchanged */}
            {/* ... */}

            {/* Products Grid */}
            <Box
              w={{ base: "70%", lg: "75%" }}
              display={"grid"}
              gridTemplateColumns={{
                base: "repeat(2,1fr)",
                md: "repeat(3,1fr)",
                lg: "repeat(4,1fr)",
              }}
              justifyContent={"center"}
              gap={{ base: "0px", lg: "20px" }}
            >
              {data.map((el: WomenProducts) =>
                el.visible === true ? (
                  <Box
                    key={el._id}
                    p={{ base: "2px", lg: "20px" }}
                    borderRadius={"10%"}
                    boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                    m="auto"
                    mt="25px"
                    h={{ base: "300px", md: "415px", lg: "475px" }} // increased height for button
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Link href={`/womens/${el._id}`}>
                      <Image
                        m="auto"
                        w={{ base: "100px", md: "180px", lg: "200px" }}
                        h={{ base: "150px", md: "250px", lg: "270px" }}
                        src={el.image}
                        alt="product_img"
                      />
                      <Heading
                        m="auto"
                        textAlign={"center"}
                        mt="5px"
                        fontSize={{ base: "16px", md: "18px", lg: "20px" }}
                        color={"#f24973"}
                      >
                        {el.heading}
                      </Heading>
                    </Link>
                    <Flex
                      justifyContent={"center"}
                      w={{ base: "100px", md: "180px", lg: "200px" }}
                      m="auto"
                    >
                      <Text
                        m="auto"
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        textAlign={"center"}
                        w={{ base: "90px", md: "180px", lg: "250px" }}
                        fontSize={{ base: "12px", md: "14px", lg: "16.5px" }}
                      >
                        {el.title}
                      </Text>
                      <Text ml="-7px" w={{ base: "10px", md: "10px", lg: "30px" }}>
                        ..
                      </Text>
                    </Flex>
                    <Text fontSize={{ base: "14px", md: "16px", lg: "18px" }} color="green">
                      {el.discount}
                    </Text>
                    <Flex justifyContent={"center"} gap="15px">
                      <Text fontSize={{ base: "12px", md: "15px", lg: "18px" }} fontWeight={"600"}>
                        ₹{el.discount_price}
                      </Text>
                      <Text
                        color="red"
                        fontSize={{ base: "12px", md: "15px", lg: "18px" }}
                        textDecoration={"line-through"}
                        fontWeight={"600"}
                      >
                        ₹{el.original_price}
                      </Text>
                    </Flex>

                    <Text fontSize={{ base: "10px", md: "14px", lg: "16.5px" }}>{el.offer}</Text>
                    {el.availability === "" ? (
                      ""
                    ) : (
                      <Text color="red" fontSize={{ base: "12px", lg: "16.5px" }}>
                        {el.availability}
                      </Text>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                      mt={3}
                      colorScheme="pink"
                      size="sm"
                      w="100%"
                      onClick={() => handleAddToCart(el)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                ) : null
              )}
            </Box>
          </Flex>

          {/* Pagination Buttons */}
          <Flex gap="20px" justifyContent={"center"} m="auto" mt="30px">
            <Button
              color={"#f24973"}
              leftIcon={<ArrowBackIcon />}
              isDisabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button isDisabled color={"#f24973"} disabled>
              {page}
            </Button>
            <Button
              color={"#f24973"}
              rightIcon={<ArrowForwardIcon />}
              isDisabled={page === 13}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default WomenProductPage;
