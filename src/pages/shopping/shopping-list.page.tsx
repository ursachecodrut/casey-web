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
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { fetchShopping, updateShoppingList } from '../../api';
import { ShoppingDto, ShoppingListItemDto } from '../../dtos';
import { useAuth } from '../../hooks';
import {
  CurrentShoppingListSchema,
  CurrentShoppingListValues,
} from '../../schemas';

interface ShoppingListFormProps {
  items: ShoppingListItemDto[];
  onSubmit: SubmitHandler<CurrentShoppingListValues>;
}

const ShoppingListForm = ({ items, onSubmit }: ShoppingListFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CurrentShoppingListValues>({
    resolver: zodResolver(CurrentShoppingListSchema),
    defaultValues: {
      items,
    },
  });

  const {
    fields: itemsFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray<CurrentShoppingListValues>({
    control,
    name: 'items',
  });

  return (
    <Stack spacing="2" as="form" onSubmit={handleSubmit(onSubmit)}>
      {itemsFields.map((item, index) => (
        <FormControl key={JSON.stringify(item)}>
          <HStack>
            <Checkbox {...register(`items.${index}.checked`)} />
            <FormControl isInvalid={Boolean(errors.items?.[index]?.name)}>
              <Input {...register(`items.${index}.name` as const)} />
            </FormControl>
            <FormControl isInvalid={Boolean(errors.items?.[index]?.quantity)}>
              <Input
                type="number"
                {...register(`items.${index}.quantity` as const, {
                  valueAsNumber: true,
                })}
              />
            </FormControl>
            <FormControl isInvalid={Boolean(errors.items?.[index]?.unit)}>
              <Input {...register(`items.${index}.unit` as const)} />
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
            quantity: 1,
            unit: '',
          });
        }}
      >
        Add item
      </Button>
      <Button type="submit" isLoading={isSubmitting}>
        Save
      </Button>
    </Stack>
  );
};

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

  const { mutateAsync } = useMutation({
    mutationKey: ['saveShoppingList', currentUser, currentUser?.uid],
    mutationFn: (items: ShoppingListItemDto[]) =>
      updateShoppingList(currentUser?.uid, items),
    onSuccess: () => {
      console.log('success');
    },
  });

  const onSubmit: SubmitHandler<CurrentShoppingListValues> = async (data) => {
    try {
      await mutateAsync(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <Container py="4" maxW="lg">
      <Stack spacing="4">
        <Heading size="lg">Your shopping list</Heading>

        <Text>Current Shopping List</Text>
        <Text colorScheme="grey">
          {format(shopping.current.updatedAt.toDate(), 'dd/MM/yyyy HH:mm')}
        </Text>

        <ShoppingListForm
          items={shopping.current.ingredients}
          onSubmit={onSubmit}
        />
      </Stack>
    </Container>
  );
};
