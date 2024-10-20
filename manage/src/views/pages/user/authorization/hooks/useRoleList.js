import { ref, unref } from 'vue'
export const useRoleList = ({
  getRoles,
  openEditModal,
  deleteFromDB,
  useDebounce,
}) => {
  const maxHeight = ref(0)
  const otherTotalHeight = 126
  const setMaxHeight = ({ height }) => {
    if (height) {
      maxHeight.value = height - otherTotalHeight
    }
  }

  const edit = (row) => {
    openEditModal({ data: row, type: 'edit' })
  }

  const { func: _deleteFromDB } = useDebounce(deleteFromDB)
  const _delete = (row) => {
    const d = $dialog.warning({
      title: '警告',
      content: '确定删除？',
      positiveText: '确定',
      negativeText: '不确定',
      maskClosable: false,
      onPositiveClick: async () => {
        d.loading = true
        try {
          await _deleteFromDB({ data: { ...unref(row) } })
          $message.success(`恭喜你，删除成功！`)
        } catch (error) {
          $message.error(error)
        }
        return await getRoles()
      },
    })
  }
  return {
    maxHeight,
    setMaxHeight,
    edit,
    _delete,
  }
}
