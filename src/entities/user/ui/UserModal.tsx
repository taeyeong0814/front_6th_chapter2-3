import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { useUserEntity } from "../model/hooks"

export const UserModal: React.FC = () => {
  const { selectedUser, showUserModal, setShowUserModal } = useUserEntity()

  if (!selectedUser) return null

  return (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img src={selectedUser.image} alt={selectedUser.username} className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              <p className="text-gray-600">@{selectedUser.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700">기본 정보</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>이메일:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>전화번호:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>나이:</strong> {selectedUser.age}세
                </p>
                <p>
                  <strong>성별:</strong> {selectedUser.gender}
                </p>
                <p>
                  <strong>생년월일:</strong> {selectedUser.birthDate}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700">신체 정보</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>키:</strong> {selectedUser.height}cm
                </p>
                <p>
                  <strong>몸무게:</strong> {selectedUser.weight}kg
                </p>
                <p>
                  <strong>혈액형:</strong> {selectedUser.bloodGroup}
                </p>
                <p>
                  <strong>눈동자:</strong> {selectedUser.eyeColor}
                </p>
                <p>
                  <strong>머리카락:</strong> {selectedUser.hair.color} ({selectedUser.hair.type})
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-700">주소</h4>
            <p className="text-sm">{selectedUser.address.address}</p>
            <p className="text-sm">
              {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.postalCode}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-700">회사 정보</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>회사명:</strong> {selectedUser.company.name}
              </p>
              <p>
                <strong>직책:</strong> {selectedUser.company.title}
              </p>
              <p>
                <strong>부서:</strong> {selectedUser.company.department}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-700">교육</h4>
            <p className="text-sm">
              <strong>대학교:</strong> {selectedUser.university}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
