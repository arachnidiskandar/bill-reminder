import { Skeleton } from '@chakra-ui/react';
import React from 'react';

const SkeletonBills = () => {
  return (
    <>
      <Skeleton h={84} my={2} />
      <Skeleton h={84} my={2} />
      <Skeleton h={84} my={2} />
      <Skeleton h={84} my={2} />
    </>
  );
};

export default SkeletonBills;
