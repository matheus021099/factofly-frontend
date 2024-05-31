import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchInvoices,
  deleteInvoice,
  createInvoice,
  fetchInvoice,
  updateInvoice,
} from '@/services/invoiceService'
import Invoice from '@/types/invoices'

export const useInvoices = () => {
  const {
    data: invoices,
    isLoading,
    isError,
    error,
  }: UseQueryResult<Invoice[], Error> = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  })

  return {
    invoices: invoices || [],
    isLoading,
    isError,
    error,
  }
}

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient()
  const { mutate: deleteInvoiceMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  return {
    deleteInvoiceMutation,
    isDeleting,
  }
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

export const useInvoice = (id: number | string) => {
  return useQuery({
    queryFn: () => fetchInvoice(id),
    queryKey: ['invoices', id],
  })
}

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}