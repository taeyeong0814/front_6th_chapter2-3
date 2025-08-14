import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { useUserEntity } from "../model/hooks"

export const UserModal: React.FC = () => {
  const { selectedUser, showUserModal, setShowUserModal } = useUserEntity()

  if (!selectedUser) return null

  return (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 프로필 이미지 */}
          <div className="flex justify-center">
            <img
              src={selectedUser.image}
              alt={selectedUser.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          {/* 사용자명 */}
          <h3 className="text-xl font-semibold text-center">{selectedUser.username}</h3>

          {/* 상세 정보 */}
          <div className="space-y-2 text-sm">
            {selectedUser.firstName && selectedUser.lastName && (
              <p>
                <strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}
              </p>
            )}

            {selectedUser.age && (
              <p>
                <strong>나이:</strong> {selectedUser.age}세
              </p>
            )}

            {selectedUser.email && (
              <p>
                <strong>이메일:</strong> {selectedUser.email}
              </p>
            )}

            {selectedUser.phone && (
              <p>
                <strong>전화번호:</strong> {selectedUser.phone}
              </p>
            )}

            {selectedUser.address && (
              <p>
                <strong>주소:</strong> {selectedUser.address.address}, {selectedUser.address.city},{" "}
                {selectedUser.address.state}
              </p>
            )}

            {selectedUser.company && (
              <p>
                <strong>직장:</strong> {selectedUser.company.name} - {selectedUser.company.title}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
