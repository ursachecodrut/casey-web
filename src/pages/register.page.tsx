import {
  Box,
  Button,
  Checkbox,
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
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordField } from '../components';
import { GoogleIcon } from '../icons';
import { useAuth } from '../hooks';

const authSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  persist: z.boolean(),
});

type RegisterFormValues = z.infer<typeof authSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSignUp: SubmitHandler<RegisterFormValues> = async (data) => {
    await signUp(data);
    navigate('/profile');
    localStorage.setItem('isAuthenticated', 'true');
  };

  const onSignInWithGoogle = async () => {
    await signInWithGoogle();
    navigate('/profile');
    localStorage.setItem('isAuthenticated', 'true');
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
              <Button variant="link" colorScheme="blue" as={Link} to="/login">
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

            <HStack justify="space-between">
              <Checkbox {...register('persist')} defaultChecked>
                Remember me
              </Checkbox>
            </HStack>

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

              <Button width="full" onClick={onSignInWithGoogle}>
                <VisuallyHidden>Sign in with Google</VisuallyHidden>
                <GoogleIcon boxSize={5} />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
