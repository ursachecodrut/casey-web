import {
  Container,
  HStack,
  Heading,
  Image,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../../hooks';

export const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Container
        maxW="lg"
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Stack spacing="4">
          <SkeletonCircle size="20" />
          <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="3" />
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <HStack justify="space-between">
        <Image
          borderRadius="full"
          boxSize={{ base: '150px', md: '200px' }}
          src={currentUser.photoURL?.replace('s96-c', 's400-c')}
          alt="Profile Pic"
        />

        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>
              {currentUser.displayName}
            </Heading>
            <Text>{currentUser.email}</Text>
            <Text>{currentUser.phoneNumber}</Text>
          </Stack>
        </Stack>
      </HStack>
    </Container>
  );
};
