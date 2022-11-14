import { Box } from '@chakra-ui/react';
import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
  varient?: 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({ children, varient = 'regular' }) => {
  return (
    <Box
      maxW={varient === 'regular' ? '800px' : '400px'}
      width="100%"
      w="100%"
      mx="auto"
    >
      {children}
    </Box>
  );
};
export default Wrapper;
