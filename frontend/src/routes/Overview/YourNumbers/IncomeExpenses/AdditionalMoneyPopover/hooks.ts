import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';

const updateSalary = gql`
  mutation CreateAdditionalMoney(
    $additionalSalaryValue: numeric
    $date: date
    $userId: String
  ) {
    insert_additional_salary_one(
      object: {
        date: $date
        additionalSalaryValue: $additionalSalaryValue
        userId: $userId
      }
    ) {
      id
    }
  }
`;
export const useSalary = (
  setSalaryCb: (a?: any) => void,
  onClose: () => void
) => {
  const [mutate, { error, loading }] = useMutation(updateSalary);
  const toast = useToast();
  const { user } = useAuth0();

  const updateUserSalary = async (salary: number) => {
    try {
      await mutate({
        variables: {
          userId: user?.sub,
          additionalSalaryValue: salary,
          date: new Date(),
        },
      });
      toast({
        title: 'Salário Atualizado',
        description: 'Seu salário foi atualizado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSalaryCb((prevSalary: number) => Number(prevSalary) + Number(salary));
      onClose();
    } catch (e: any) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Ocorreu um erro.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return { error, loading, updateUserSalary };
};
