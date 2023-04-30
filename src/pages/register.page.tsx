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
  Stack,
  Text,
  VisuallyHidden,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FirebaseError } from 'firebase/app';
import { PasswordField } from '../components';
import { handleFirebaseError } from '../firebase/firebase.errors';
import { AuthFormValues, AuthSchema } from '../schemas';
import { signInWithFacebook, signInWithGoogle, signUp } from '../api/auth.api';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(AuthSchema),
  });
  const toast = useToast();

  const onSignUp: SubmitHandler<AuthFormValues> = async (data) => {
    await signUp(data);
    navigate('/profile');
  };

  const onSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate('/profile');
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
              Register your new account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Already have an account?</Text>
              <Button variant="link" colorScheme="purple" as={Link} to="/login">
                Sign in
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
          onSubmit={handleSubmit(onSignUp)}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="exemple@email.com"
                  autoComplete="email"
                  {...register('email')}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <PasswordField
                error={errors.password}
                registerReturn={register('password')}
              />
            </Stack>

            <Stack spacing="6">
              <Button type="submit" variant="outline" isLoading={isSubmitting}>
                Sign up
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
    </Container>
  );
};
