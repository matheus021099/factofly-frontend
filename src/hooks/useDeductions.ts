import { createDeduction } from '@/services/deductionService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateDeduction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeduction,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['deductions'] })
    },
  })
}
import { fetchDeductions, deleteDeduction } from '@/services/deductionService'

export const useDeductions = () => {
  const {
    data: deductions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['deductions'],
    queryFn: fetchDeductions,
  })

  return {
    deductions: deductions || [],
    isLoading,
    isError,
    error,
  }
}

export const useDeleteDeduction = () => {
  const queryClient = useQueryClient()
  const { mutate: deleteDeductionMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteDeduction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['deductions'] })
      },
    })

  return {
    deleteDeductionMutation,
    isDeleting,
  }
}