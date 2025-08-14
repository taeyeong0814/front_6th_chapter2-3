import { useUIStore, useUserStore } from "../shared/stores"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../shared/ui"

const UserModal = () => {
  // Zustand 스토어 직접 사용
  const { selectedUser } = useUserStore()
  const { showUserModal, setShowUserModal } = useUIStore()

  const user = selectedUser
  const isOpen = showUserModal
  const onClose = () => setShowUserModal(false)

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 프로필 이미지 */}
          <div className="flex justify-center">
            <img
              src={user.image}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          {/* 사용자명 */}
          <h3 className="text-xl font-semibold text-center">{user.username}</h3>

          {/* 상세 정보 */}
          <div className="space-y-2 text-sm">
            {user.firstName && user.lastName && (
              <p>
                <strong>이름:</strong> {user.firstName} {user.lastName}
              </p>
            )}

            {user.age && (
              <p>
                <strong>나이:</strong> {user.age}세
              </p>
            )}

            {user.email && (
              <p>
                <strong>이메일:</strong> {user.email}
              </p>
            )}

            {user.phone && (
              <p>
                <strong>전화번호:</strong> {user.phone}
              </p>
            )}

            {user.address && (
              <p>
                <strong>주소:</strong> {user.address.address}, {user.address.city}, {user.address.state}
              </p>
            )}

            {user.company && (
              <p>
                <strong>직장:</strong> {user.company.name} - {user.company.title}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserModal
