import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { ElectronicProducts } from "../../utils/types";
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { DebounceInput } from "react-debounce-input";
import {
  sortByCategory,
  sortByPhone,
  sortByLaptop,
  sortByTv,
} from "../../config/electronicData";
import { useAddToCart } from "../../utils/cartUtils"; // ✅ added central handler import

const ElectronicsPage = () => {
  const [data, setData] = useState<ElectronicProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortPrice, setSortPrice] = useState("");
  const [order, setOrder] = useState("discount_price");
  const [limit, setLimit] = useState<string | number>(25);

  const { handleAddToCart } = useAddToCart(); // ✅ unified add to cart logic

  const getData = async () => {
    setLoading(true);
    await axios
      .get(
        `https://e-shop-215k.onrender.com/electronics?page=${page}&limit=${limit}&category=${category}&brand=${brand}&sort=${order},${sortPrice}&search=${search}`
      )
      .then((res: AxiosResponse) => {
        setData(res.data.electronics);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getData();
  }, [page, category, brand, sortPrice, limit, search]);

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
            >
              <Box
                ml="20px"
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <DebounceInput
                style={{
                  marginLeft: "20px",
                  width: "100%",
                  border: "none",
                  borderColor: "transparent",
                  padding: "10px",
                  outline: "none",
                }}
                debounceTimeout={2000}
                value={search}
                placeholder="Search in Electronics-Collection"
                onChange={handleChange}
              />
            </Flex>
          </Flex>

          <Flex
            w="98%"
            m="auto"
            gap={{ base: 2, lg: 5 }}
            justifyContent={"center"}
          >
            {/* Filters section (unchanged) */}

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
              {data.map((el: ElectronicProducts) =>
                el.visible ? (
                  <Box
                    key={el._id}
                    p={{ base: "2px", lg: "20px" }}
                    borderRadius={"10%"}
                    boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                    m="auto"
                    mt="25px"
                    h={{ base: "280px", md: "370px", lg: "470px" }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Link href={`/electronics/${el._id}`}>
                      <Image
                        m="auto"
                        w={{ base: "100px", md: "180px", lg: "200px" }}
                        h={{ base: "150px", md: "250px", lg: "270px" }}
                        src={el.image}
                        alt="product_img"
                      />
                      <Flex
                        justifyContent={"center"}
                        w={{ base: "100px", md: "180px", lg: "200px" }}
                        m="auto"
                      >
                        <Text
                          m="auto"
                          whiteSpace={"nowrap"}
                          overflow={"hidden"}
                          mt="15px"
                          fontWeight={"bold"}
                          textAlign={"center"}
                          w={{ base: "90px", md: "180px", lg: "250px" }}
                          fontSize={{ base: "12px", md: "14px", lg: "16.5px" }}
                        >
                          {el.title}
                        </Text>
                      </Flex>
                    </Link>

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

                    <Text fontSize={{ base: "10px", md: "14px", lg: "16.5px" }}>
                      {el.offer}
                    </Text>
                    {el.availability && (
                      <Text color="red" fontSize={{ base: "12px", lg: "16.5px" }}>
                        {el.availability}
                      </Text>
                    )}

                    {/* Unified Add to Cart Button */}
                    <Button
                      colorScheme="pink"
                      mt={4}
                      size="sm"
                      onClick={() => handleAddToCart(el)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                ) : null
              )}
            </Box>
          </Flex>

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

export default ElectronicsPage;
