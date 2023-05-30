import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../hooks';
import { handleFirebaseError } from '../firebase/firebase.errors';

type Link = {
  name: string;
  path: string;
  protected: boolean;
};

const Links: Link[] = [
  {
    name: 'Recipes',
    path: '/recipes',
    protected: false,
  },
  {
    name: 'Shopping',
    path: '/shopping',
    protected: true,
  },
  {
    name: 'Add Recipe',
    path: '/add-recipe',
    protected: true,
  },
  {
    name: 'History',
    path: '/history',
    protected: true,
  },
];

const NavLink = ({ link }: { link: Link }) => {
  const { currentUser } = useAuth();
  const colorModeValue = useColorModeValue('gray.200', 'gray.700');

  if (link.protected && !currentUser) return null;

  return (
    <ChakraLink
      as={RouterLink}
      px={2}
      py={1}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: colorModeValue,
      }}
      to={link.path}
    >
      {link.name}
    </ChakraLink>
  );
};

export const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      onClose();
      await logout();
      navigate('/login');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    }
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Box>Casey</Box>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} link={link} />
            ))}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          {currentUser ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  src={currentUser.photoURL ?? ''}
                  referrerPolicy="no-referrer"
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <ButtonGroup gap={2}>
              <Button
                variant="solid"
                colorScheme="purple"
                as={RouterLink}
                to="/login"
              >
                Login
              </Button>
            </ButtonGroup>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name} link={link} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};
