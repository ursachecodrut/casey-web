import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useFieldArray, useForm } from 'react-hook-form';
import { fetchShopping } from '../../api';
import { ShoppingDto } from '../../dtos/shopping-lists.dto';
import { useAuth } from '../../hooks';
import {
  CurrentShoppingListSchema,
  CurrentShoppingListValues,
} from '../../schemas';

export const ShoppingListPage = () => {
  const { currentUser } = useAuth();

  const {
    data: shopping,
    isLoading,
    isError,
  } = useQuery<ShoppingDto, Error>({
    queryKey: ['shopping', currentUser, currentUser?.uid],
    queryFn: () => fetchShopping(currentUser?.uid),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CurrentShoppingListValues>({
    resolver: zodResolver(CurrentShoppingListSchema),
  });

  const {
    fields: itemsFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray<CurrentShoppingListValues>({
    control,
    name: 'items',
  });

  // const { mutateAsync } = useMutation({
  //   mutationKey: ['shopping'],
  //   mutationFn: () => {},
  // );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <Container py="4" maxW="lg">
      <Stack
        spacing="4"
        as="form"
        onSubmit={handleSubmit((data) => console.log(data))}
      >
        <Heading size="lg">Your shopping list</Heading>

        <Text>Current Shopping List</Text>
        <Text colorScheme="grey">
          {format(shopping.current.updatedAt.toDate(), 'dd/MM/yyyy HH:mm')}
        </Text>

        <Stack spacing="2">
          {shopping.current.ingredients.map((item, index) => (
            <FormControl key={JSON.stringify(item)}>
              <HStack>
                <Checkbox {...register(`items.${index}.checked`)} />
                <FormControl isInvalid={Boolean(errors.items?.[index]?.name)}>
                  <Input
                    value={item.name}
                    {...register(`items.${index}.name` as const)}
                  />
                </FormControl>
                <FormControl
                  isInvalid={Boolean(errors.items?.[index]?.quantity)}
                >
                  <Input
                    value={item.quantity}
                    {...register(`items.${index}.quantity` as const)}
                  />
                </FormControl>
                <FormControl isInvalid={Boolean(errors.items?.[index]?.unit)}>
                  <Input
                    value={item.unit}
                    {...register(`items.${index}.unit` as const)}
                  />
                </FormControl>
                <Button onClick={() => removeItem(index)}>
                  <DeleteIcon />
                </Button>
              </HStack>
            </FormControl>
          ))}
          {itemsFields.map((item, index) => (
            <FormControl key={JSON.stringify(item)}>
              <HStack>
                <Checkbox {...register(`items.${index}.checked`)} />
                <FormControl isInvalid={Boolean(errors.items?.[index]?.name)}>
                  <Input
                    value={item.name}
                    {...register(`items.${index}.name` as const)}
                  />
                </FormControl>
                <FormControl
                  isInvalid={Boolean(errors.items?.[index]?.quantity)}
                >
                  <Input
                    value={item.quantity}
                    {...register(`items.${index}.quantity` as const)}
                  />
                </FormControl>
                <FormControl isInvalid={Boolean(errors.items?.[index]?.unit)}>
                  <Input
                    value={item.unit}
                    {...register(`items.${index}.unit` as const)}
                  />
                </FormControl>
                <Button onClick={() => removeItem(index)}>
                  <DeleteIcon />
                </Button>
              </HStack>
            </FormControl>
          ))}
          <Button
            onClick={() => {
              appendItem({
                checked: false,
                name: '',
                quantity: '',
                unit: '',
              });
            }}
          >
            Add item
          </Button>
          <Button type="submit">Save</Button>
        </Stack>
      </Stack>
    </Container>
  );
};
