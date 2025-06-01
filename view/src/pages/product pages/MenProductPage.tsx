// src/pages/MenProductPage.tsx 
import React, { useEffect, useState } from "react";
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
  Alert,
  AlertIcon,
  CloseButton,
  AlertTitle,
} from "@chakra-ui/react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import { useSearchParams } from "react-router-dom";
import {
  menSortByCategory,
  menSortByTshirt,
  menSortByJeans,
  menSortByShoes,
  menSortByWatches,
} from "../config/filterData";
import Pagination from "../components/Pagination";

const MenProductPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const category = searchParams.get("category") || "All";
  const brand = searchParams.get("brand") || "All";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "";

  const setCategory = (e) => {
    setSearchParams({ category: e.target.value, brand, sortBy, order });
  };

  const setBrand = (e) => {
    setSearchParams({ category, brand: e.target.value, sortBy, order });
  };

  const setSort = (e) => {
    setSearchParams({ category, brand, sortBy: e.target.value, order: "asc" });
  };

  const setOrderBy = (e) => {
    if (category === "All") {
      toast({
        duration: 5000,
        isClosable: true,
        render: () => (
          <Alert status="warning" borderRadius="lg" bg="orange" color="white">
            <AlertIcon />
            <AlertTitle mb={0} mr={2} fontSize="md">
              Please Select Category First
            </AlertTitle>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        ),
      });
    } else {
      setSearchParams({ category, brand, sortBy, order: e.target.value });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://e-shop-215k.onrender.com/mens?page=${page}&limit=${limit}&category=${category}&brand=${brand}&sort=${sortBy}&order=${order}&search=${search}`
        );
        setData(res.data.men);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [page, limit, category, brand, sortBy, order, search]);

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
              <Link href={"/mens"}>
                <Heading color={"#f24973"} m="25px">
                  MENS COLLECTION
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
                <Image src="/search-icon.svg" alt="search icon" />
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
                placeholder="Search in Men-Collection"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Flex>
          </Flex>

          <Flex w="98%" m="auto" gap={{ base: 2, lg: 5 }} justifyContent={"center"}>
            <Box
              boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
              w={{ base: "25%", lg: "20%" }}
              display={"flex"}
              flexDirection={"column"}
              mt="20px"
              p="10px"
            >
              {/* ITEMS PER PAGE */}
              <Box bgColor={"gray.100"} p="20px" mt="15px" lineHeight={"30px"}>
                <Text
                  color={"#f24973"}
                  fontSize={{ base: "12px", lg: "15px" }}
                  mb="10px"
                  fontWeight={"600"}
                >
                  ITEMS PER PAGE
                </Text>
                <hr />
                <Flex justifyContent={"center"} m="auto" gap="10px" mt="10px">
                  <select
                    onChange={(e) => setLimit(Number(e.target.value))}
                    style={{ width: "80px" }}
                    value={limit}
                  >
                    {[10, 20, 25, 30, 40, 50].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </Flex>
              </Box>

              {/* CATEGORY FILTER */}
              <Box bgColor={"gray.100"} p="20px" mt="15px" lineHeight={"30px"}>
                <Text
                  color={"#f24973"}
                  fontSize={{ base: "12px", lg: "15px" }}
                  mb="10px"
                  fontWeight={"600"}
                >
                  SORT BY CATEGORY
                </Text>
                <hr />
                {["All", ...menSortByCategory].map((product, i) => (
                  <Flex
                    key={i}
                    justifyContent={"space-between"}
                    m="auto"
                    gap="10px"
                    w="80%"
                    mt="8px"
                  >
                    <Text fontSize={{ base: "10px", md: "12px", lg: "15px" }}>
                      {product}
                    </Text>
                    <input
                      type="radio"
                      name="category"
                      value={product}
                      checked={category === product}
                      onChange={setCategory}
                    />
                  </Flex>
                ))}
              </Box>

              {/* BRAND FILTER */}
              <Box bgColor={"gray.100"} p="20px" mt="15px" lineHeight={"30px"}>
                <Text
                  color={"#f24973"}
                  fontSize={{ base: "12px", lg: "15px" }}
                  mb="10px"
                  fontWeight={"600"}
                >
                  SORT BY BRAND
                </Text>
                <hr />
                {["All", ...menSortByTshirt, ...menSortByJeans, ...menSortByShoes, ...menSortByWatches].map(
                  (product, i) => (
                    <Flex
                      key={i}
                      justifyContent={"space-between"}
                      m="auto"
                      gap="10px"
                      w="80%"
                      mt="8px"
                    >
                      <Text fontSize={{ base: "10px", md: "12px", lg: "15px" }}>
                        {product}
                      </Text>
                      <input
                        type="radio"
                        name="brand"
                        value={product}
                        checked={brand === product}
                        onChange={setBrand}
                      />
                    </Flex>
                  )
                )}
              </Box>

              {/* SORT & ORDER */}
              <Box bgColor={"gray.100"} p="20px" mt="15px" lineHeight={"30px"}>
                <Text
                  color={"#f24973"}
                  fontSize={{ base: "12px", lg: "15px" }}
                  mb="10px"
                  fontWeight={"600"}
                >
                  SORT & ORDER
                </Text>
                <hr />
                <Flex
                  m="auto"
                  justifyContent={"space-around"}
                  w="80%"
                  mt="10px"
                  gap="10px"
                >
                  <select
                    onChange={setSort}
                    style={{ width: "150px" }}
                    value={sortBy}
                  >
                    <option value="">Sort By</option>
                    <option value="price">Price</option>
                    <option value="title">Title</option>
                  </select>
                  <select
                    onChange={setOrderBy}
                    style={{ width: "150px" }}
                    value={order}
                  >
                    <option value="">Order By</option>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                </Flex>
              </Box>
            </Box>

            {/* PRODUCTS GRID */}
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
                    <Link href={`/mens/${product._id}`}>
                      <Image
                        src={product.image[0]}
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
                    <Text fontWeight={"600"}>${product.price}</Text>

                    <Button
                      mt={3}
                      colorScheme="pink"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Added to Cart",
                          description: `${product.title} added to your cart.`,
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                          position: "top",
                        });
                      }}
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

          {/* Pagination Component */}
          <Pagination page={page} setPage={setPage} totalPages={10} />
        </Box>
      )}
    </>
  );
};

export default MenProductPage;
