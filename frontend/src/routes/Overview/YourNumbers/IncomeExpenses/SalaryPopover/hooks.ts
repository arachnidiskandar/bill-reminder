import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@chakra-ui/react';

const updateSalary = gql`
  mutation UpdateSalary($id: String!, $salary: numeric!) {
    update_Users(where: { auth0Id: { _eq: $id } }, _set: { salary: $salary }) {
      affected_rows
    }
  }
`;
export const useSalary = (
  setSalaryCb: (salary: number | undefined) => void
) => {
  const [mutate, { error, loading }] = useMutation<{
    id: string;
  }>(updateSalary);
  const toast = useToast();
  const { user } = useAuth0();
  const updateUserSalary = async (salary: number | undefined) => {
    setSalaryCb(salary);
    try {
      await mutate({ variables: { id: user?.sub, salary } });
      toast({
        title: 'Salário Atualizado',
        description: 'Seu salário foi atualizado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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
