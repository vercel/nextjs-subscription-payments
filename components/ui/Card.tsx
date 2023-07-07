'use client';
import { Box, Text, Button, Image, useBreakpointValue } from '@chakra-ui/react';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

const Card = ({ title, description, imageUrl, buttonText, buttonLink }: CardProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="6"
      boxShadow="md"
      w={{ base: '100%', md: 'auto' }}
    >
      <Image src={imageUrl} alt={title} mb="4" w={isMobile ? '100%' : 'auto'} />
      <Text fontWeight="bold" fontSize="xl" mb="2">
        {title}
      </Text>
      <Text fontSize="md" mb="4">
        {description}
      </Text>
      <Button as="a" href={buttonLink} colorScheme="blue" w={isMobile ? '100%' : 'auto'}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default Card;