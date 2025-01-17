import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useForm, SubmitHandler } from 'react-hook-form'
import CustomerForm from '@/components/Form/CustomerForm'
import { Inputs } from '@/components/Form/CustomerForm'

const Title = styled('span')({
  fontWeight: 700,
  fontSize: '2.25rem',
  color: 'rgb(108, 117, 125)',
})

const CreateCustomer = () => {
  const form = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    form.reset()
  }

  return (
    <Box display="flex" justifyContent="left" flexDirection="column">
      <Title>Create customer</Title>

      <CustomerForm form={form} onSubmit={onSubmit} />
    </Box>
  )
}

export default CreateCustomer
