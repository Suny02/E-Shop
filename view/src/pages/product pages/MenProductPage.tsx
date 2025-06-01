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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";
import { ElectronicProducts } from "../../utils/types";
import {
  sortByCategory,
  sortByPhone,
  sortByLaptop,
  sortByTv,
} from "../../config/electronicData";
import Pagination from "../../components/Pagination";

const ElectronicsPage = () => {
  const [data, setData] = useState<ElectronicProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const toast = useToast();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://e-shop-215k.onrender.com/electronics?page=${page}&limit=${limit}&search=${search}`
      );
      setData(res.data.electronics);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page, limit, search]);

  const handleAddToCart = (product: ElectronicProducts) => {
    // push to GA4 DataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "add_to_cart",
        product_name: product.title,
        product_price: product.discount_price,
      });
    }

    toast({
      title: "Added to Cart",
      description: `${product.title} added to your cart.`,
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
          <Flex
            w="95%"
            flexDirection={{ base: "column", md: "row" }}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box>
              <Link href={"/electronics"}>
                <Heading color={"#f24973"} m="25px">
                  ELECTRONICS COLLECTION
                </Heading>
              </Link>
            </Box>
            <Flex
              w={{ base: "100%", md: "60%", lg: "75%" }}
              alignItems={"center"}
              border={"solid 1px pink"}
              h={"50px"}
              mb={{ base: "15px", md: "0" }}
            >
              <Box ml="20px" pointerEvents="none">
                <SearchIcon color="gray.300" />
              </Box>
              <DebounceInput
                style={{
                  marginLeft: "20px",
                  width: "100%",
                  border: "none",
                  padding: "10px",
                  outline: "none",
                }}
                debounceTimeout={2000}
                value={search}
                placeholder="Search in Electronics-Collection"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Flex>
          </Flex>

          <Flex
            w="98%"
            m="auto"
            gap={{ base: 2, lg: 5 }}
            justifyContent={"center"}
          >
            <Flex
              w="70%"
              justifyContent="center"
              gap={{ base: 5, lg: 10 }}
              flexWrap={"wrap"}
              mt="20px"
            >
              {data.length > 0 ? (
                data.map((product) => (
                  <Box
                    key={product._id}
                    border={"1px solid #f24973"}
                    borderRadius={"10px"}
                    maxW={"300px"}
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                    p="10px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Link href={`/electronics/${product._id}`}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        m="auto"
                        w="90%"
                        borderRadius="10px"
                        cursor={"pointer"}
                      />
                    </Link>
                    <Heading
                      fontSize={"md"}
                      noOfLines={2}
                      mt="10px"
                      color={"#f24973"}
                      cursor={"pointer"}
                    >
                      {product.title}
                    </Heading>
                    <Text fontWeight={"600"}>₹{product.discount_price}</Text>

                    <Button
                      mt={3}
                      colorScheme="pink"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      w="100%"
                    >
                      Add to Cart
                    </Button>
                  </Box>
                ))
              ) : (
                <Text>No products found.</Text>
              )}
            </Flex>
          </Flex>

          <Pagination page={page} setPage={setPage} totalPages={10} />
        </Box>
      )}
    </>
  );
};

export default ElectronicsPage;
