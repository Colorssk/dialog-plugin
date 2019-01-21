
const rules = {
  input: { required: true, message: '请按要求输入', trigger: 'blur' },
  select: { required: true, message: '请按要求选择', trigger: ['blur', 'change'] },
  radio: { required: true, message: '请按要求输入', trigger: 'blur' }
}
export default rules
