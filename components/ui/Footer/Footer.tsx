'use client';
import { Box, Grid, GridItem, Link, VStack, Text, Flex, useColorModeValue } from "@chakra-ui/react";

import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';

export default function Footer() {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box as="footer" maxW="1920px" px={6} bg="gray.800" color="white" mx="auto">
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(12, 1fr)" }}
        gap={8} 
        py={12} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
      >
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Link href="/" display="flex" alignItems="center" fontWeight="bold" border="1px" borderColor="gray.600" borderRadius="full" p={1}>
            <Logo boxSize={6} />
            <Text ml={2}>ACME</Text>
          </Link>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <VStack alignItems="flex-start" spacing={4}>
            {['Home', 'About', 'Careers', 'Blog'].map((item) => (
              <Link key={item} href="/" color="white" _hover={{ color: hoverColor }}>
                {item}
              </Link>
            ))}
          </VStack>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <VStack alignItems="flex-start" spacing={4}>
            <Text fontWeight="bold">LEGAL</Text>
            {['Privacy Policy', 'Terms of Use'].map((item) => (
              <Link key={item} href="/" color="white" _hover={{ color: hoverColor }}>
                {item}
              </Link>
            ))}
          </VStack>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 6 }}>
          <Flex justify="flex-end">
            <Link href="https://github.com/vercel/nextjs-subscription-payments" isExternal>
              <GitHub boxSize={6} />
            </Link>
          </Flex>
        </GridItem>
      </Grid>

      <Flex 
        direction={{ base: "column", md: "row" }} 
        justify="space-between" 
        align="center" 
        py={12}
      >
        <Text>&copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.</Text>
        <Flex align="center">
          <Text>Crafted by</Text>
          <Link href="https://vercel.com" isExternal>
            <Box as="img" src="/vercel.svg" alt="Vercel.com Logo" h={6} ml={4} />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
