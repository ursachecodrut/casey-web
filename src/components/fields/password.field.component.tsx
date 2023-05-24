import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
} from '@chakra-ui/react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface Props extends InputProps {
  error?: FieldError;
  registerReturn?: UseFormRegisterReturn<'password'>;
}

export const PasswordField = ({
  error = undefined,
  registerReturn = undefined,
  ...rest
}: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  const onClickReveal = () => {
    onToggle();
  };

  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormLabel htmlFor="password">Password</FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <ViewIcon /> : <ViewOffIcon />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          id="password"
          type={isOpen ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="********"
          ref={registerReturn?.ref}
          name={registerReturn?.name}
          onBlur={registerReturn?.onBlur}
          onChange={registerReturn?.onChange}
          {...rest}
        />
      </InputGroup>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

PasswordField.displayName = 'PasswordField';
