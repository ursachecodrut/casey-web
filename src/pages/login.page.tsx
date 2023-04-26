import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VisuallyHidden,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { PasswordField } from '../components';
import { handleFirebaseError } from '../firebase/firebase.errors';
import {
  AuthFormValues,
  AuthSchema,
  EmailFormValues,
  EmailSchema,
} from '../schemas';
import {
  resetPassword,
  signIn,
  signInWithFacebook,
  signInWithGoogle,
} from '../api/auth.api';

export const LoginPage = () => {
  const navigate = useNavigate();
  // const { loading, currentUser } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit: handleSubmitSignIn,
    register: registerSignIn,
    formState: { errors: errorsSignIn, isSubmitting: isSubmittingSignIn },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(AuthSchema),
  });
  const {
    handleSubmit: handleSubmitPasswordReset,
    register: registerPasswordReset,
    formState: {
      errors: errorsPasswordReset,
      isSubmitting: isSubmittingPasswordReset,
    },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(EmailSchema),
  });

  const onSignIn: SubmitHandler<AuthFormValues> = async (data) => {
    try {
      await signIn(data);
      navigate('/profile');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    }
  };

  const onPasswordReset: SubmitHandler<EmailFormValues> = async (data) => {
    try {
      await resetPassword(data.email);
      onClose();
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for further instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    }
  };

  const onSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate('/test');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    }
  };

  const onSignInWithFacebook = async () => {
    try {
      await signInWithFacebook();
      navigate('/profile');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast(handleFirebaseError(error));
      } else {
        throw error;
      }
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Text
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="4xl"
              fontWeight="extrabold"
            >
              Casey
            </Text>
            <Heading size={{ base: 'xs', md: 'sm' }}>
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Don&lsquo;t have an account?</Text>
              <Button
                variant="link"
                colorScheme="purple"
                as={Link}
                to="/register"
              >
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Stack>

        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg-surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          as="form"
          onSubmit={handleSubmitSignIn(onSignIn)}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl isInvalid={Boolean(errorsSignIn.email)}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="exemple@email.com"
                  autoComplete="email"
                  {...registerSignIn('email')}
                />
                <FormErrorMessage>
                  {errorsSignIn.email && errorsSignIn.email.message}
                </FormErrorMessage>
              </FormControl>

              <PasswordField
                error={errorsSignIn.password}
                registerReturn={registerSignIn('password')}
              />
            </Stack>

            <HStack justify="end">
              <Button
                variant="link"
                colorScheme="purple"
                size="sm"
                onClick={onOpen}
              >
                Forgot password?
              </Button>
            </HStack>

            <Stack spacing="6">
              <Button
                type="submit"
                variant="outline"
                isLoading={isSubmittingSignIn}
              >
                Sign in
              </Button>

              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>

              <ButtonGroup width="full">
                <Button width="full" onClick={onSignInWithGoogle}>
                  <VisuallyHidden>Sign in with Google</VisuallyHidden>
                  <FcGoogle size={20} />
                </Button>
                <Button
                  width="full"
                  colorScheme="facebook"
                  onClick={onSignInWithFacebook}
                >
                  <VisuallyHidden>Sign in with Google</VisuallyHidden>
                  <FaFacebook size={20} />
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {/* Password Reset Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmitPasswordReset(onPasswordReset)}
        >
          <ModalHeader>Forgot your password?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={Boolean(errorsPasswordReset.email)}>
              <FormLabel>You will get an email with a reset link</FormLabel>
              <Input
                placeholder="Email to be reset"
                {...registerPasswordReset('email')}
              />
              <FormErrorMessage>
                {errorsPasswordReset.email && errorsPasswordReset.email.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              colorScheme="purple"
              mr={3}
              isLoading={isSubmittingPasswordReset}
            >
              Request Reset
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};
