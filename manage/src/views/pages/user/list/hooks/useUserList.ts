import { useDebounce } from '@/hooks/useDebounce'
import { ref, watch, Ref } from 'vue'
import { useResizeContainer } from '@/hooks/useResizeContainer'
import {
  // Input
  I_useEditModal_open,
  I_useResetPasswordModal_open,
  I_useApiCenter_deleteFromDB,
  I_useFilters_queryUsers,
  // Output
  I_useUserList_setMaxHeight,
  I_useUserList_edit,
  I_useUserList_resetPassword,
  I_useUserList__delete,
} from '../interfaces/method'

interface Input {
  openEditModal: I_useEditModal_open
  openResetPasswordModal: I_useResetPasswordModal_open
  deleteFromDB: I_useApiCenter_deleteFromDB
  queryUsers: I_useFilters_queryUsers
}

export const useUserList = ({
  openEditModal,
  openResetPasswordModal,
  deleteFromDB,
  queryUsers,
}: Input) => {
  // 响应式表格高度
  const maxHeight = ref(0)
  let panelHeight = 0
  const otherTotalHeight = ref(0)
  const { height: actionHeaderHeight } = useResizeContainer('action-header')
  watch(
    actionHeaderHeight,
    () => {
      otherTotalHeight.value = 125 + actionHeaderHeight.value
      maxHeight.value = panelHeight - otherTotalHeight.value
    },
    { immediate: true }
  )
  const setMaxHeight: I_useUserList_setMaxHeight = ({ height }) => {
    if (height) {
      panelHeight = height
      maxHeight.value = panelHeight - otherTotalHeight.value
    }
  }
  // 防抖包裹
  const {
    func: _deleteFromDB,
  }: { ifProcessing: Ref<boolean>; func: I_useApiCenter_deleteFromDB } =
    useDebounce(deleteFromDB)
  // 核心方法
  const edit: I_useUserList_edit = (row) => {
    openEditModal({ data: row, type: 'edit' })
  }

  const resetPassword: I_useUserList_resetPassword = (row) => {
    openResetPasswordModal({ data: row })
  }

  const _delete: I_useUserList__delete = (row) => {
    const d = window.$dialog.warning({
      title: '警告',
      content: '确定删除？',
      positiveText: '确定',
      negativeText: '不确定',
      maskClosable: false,
      onPositiveClick: async () => {
        d.loading = true
        try {
          await _deleteFromDB({ data: row })
          window.$message.success(`恭喜你，删除成功！`)
        } catch (error) {
          window.$message.error(error)
        }
        return await queryUsers()
      },
    })
  }
  const data = { maxHeight }
  const method = { setMaxHeight, edit, resetPassword, _delete }
  return {
    ...data,
    ...method,
  }
}
