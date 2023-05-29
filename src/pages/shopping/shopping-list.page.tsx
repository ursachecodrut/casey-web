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
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { format } from 'date-fns';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import { addListToHistory, fetchShopping, updateShoppingList } from '../../api';
import { ShoppingDto, ShoppingListDto, ShoppingListItemDto } from '../../dtos';
import { useAuth } from '../../hooks';
import {
  CurrentShoppingListSchema,
  CurrentShoppingListValues,
} from '../../schemas';
import { handleFirebaseError } from '../../firebase/firebase.errors';

interface ShoppingListFormProps {
  userId: string | undefined;
  shopping: ShoppingDto;
  saveCurrentList: UseMutateAsyncFunction<
    void,
    unknown,
    ShoppingListItemDto[],
    unknown
  >;
}

const ShoppingListForm = ({
  userId,
  shopping,
  saveCurrentList,
}: ShoppingListFormProps) => {
  const toast = useToast();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CurrentShoppingListValues>({
    resolver: zodResolver(CurrentShoppingListSchema),
    defaultValues: { items: shopping.current.ingredients },
  });

  const {
    fields: itemsFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray<CurrentShoppingListValues>({
    control,
    name: 'items',
  });

  const onSubmit: SubmitHandler<CurrentShoppingListValues> = async (data) => {
    try {
      await saveCurrentList(data.items);
      toast({
        title: 'Shopping list saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleFirebaseError(error);
      } else {
        throw error;
      }
    }
  };

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['endShopping', userId],
    mutationFn: (currentList: ShoppingListDto) =>
      addListToHistory(userId, currentList),
    onSuccess: () => {
      setValue('items', []);
      toast({
        title: 'Shopping list closed',
        description: 'Shopping list has been moved to history',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleEndShopping = async () => {
    try {
      const currentList = getValues('items');
      await mutateAsync({
        ingredients: currentList,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleFirebaseError(error);
      } else {
        throw error;
      }
    }
  };

  const handleClearList = () => {
    setValue('items', []);
  };

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
      <Button type="submit" colorScheme="green" isLoading={isSubmitting}>
        Save
      </Button>
      <Button type="button" colorScheme="purple" onClick={handleClearList}>
        Clear
      </Button>
      <Button
        type="button"
        colorScheme="red"
        onClick={handleEndShopping}
        isLoading={isLoading}
      >
        End Shopping
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
    queryKey: ['shopping', currentUser?.uid],
    queryFn: () => fetchShopping(currentUser?.uid),
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['saveShoppingList', currentUser?.uid],
    mutationFn: (items: ShoppingListItemDto[]) =>
      updateShoppingList(currentUser?.uid, items),
  });

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
          userId={currentUser?.uid}
          shopping={shopping}
          saveCurrentList={mutateAsync}
        />
      </Stack>
    </Container>
  );
};
